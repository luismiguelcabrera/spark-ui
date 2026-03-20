"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- field array hook requires any for arbitrary field values */

import { useRef, useCallback, useMemo } from "react";
import type { UseFormReturn } from "./use-form";

// ── Types ──

export type FieldArrayItem = {
  /** Stable unique ID for this array item (for React keys) */
  id: string;
  /** The raw value of this array item */
  value: any;
  /** The current index of this item in the array */
  index: number;
  /** Returns value/onChange/onBlur/name props for a sub-property of this item */
  getFieldProps: (subField: string) => {
    value: any;
    onChange: (e: any) => void;
    onBlur: () => void;
    name: string;
  };
};

export type UseFieldArrayReturn = {
  /** Array items with stable IDs and field prop helpers */
  fields: FieldArrayItem[];
  /** Append an item to the end of the array */
  append: (item: any) => void;
  /** Prepend an item to the start of the array */
  prepend: (item: any) => void;
  /** Remove the item at the given index */
  remove: (index: number) => void;
  /** Move an item from one index to another */
  move: (from: number, to: number) => void;
  /** Swap two items by index */
  swap: (indexA: number, indexB: number) => void;
  /** Insert an item at a specific index */
  insert: (index: number, item: any) => void;
  /** Replace the item at a specific index */
  replace: (index: number, item: any) => void;
  /** Remove all items from the array */
  clear: () => void;
};

// ── Helpers ──

function extractValue(e: any): any {
  if (
    e !== null &&
    typeof e === "object" &&
    "target" in e &&
    e.target !== undefined
  ) {
    const target = e.target as HTMLInputElement;
    if (target.type === "checkbox") return target.checked;
    return target.value;
  }
  return e;
}

// ── Hook ──

/**
 * useFieldArray — manages a dynamic array of repeatable field rows within a form.
 *
 * Reads `form.values[name]` as an array, assigns stable IDs to each item,
 * and provides mutation methods that call `form.setFieldValue(name, newArray)`.
 *
 * @example
 * ```tsx
 * const form = useForm({ initialValues: { items: [{ name: "" }] } });
 * const { fields, append, remove } = useFieldArray(form, "items");
 *
 * {fields.map((field) => (
 *   <input key={field.id} {...field.getFieldProps("name")} />
 * ))}
 * <button onClick={() => append({ name: "" })}>Add</button>
 * ```
 */
export function useFieldArray<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  name: keyof T,
): UseFieldArrayReturn {
  // Stable ID counter — persists across renders
  const idCounterRef = useRef(0);
  // Map from item reference/index to stable ID
  const idMapRef = useRef<Map<number, string>>(new Map());
  // Track the last known array length to detect resets
  const lastArrayRef = useRef<any[]>([]);

  const currentArray: any[] = (form.values[name] as any) ?? [];

  // Assign stable IDs — generate new ones for items that don't have them
  const getStableId = useCallback((index: number, arr: any[]): string => {
    // If the array changed size or reference, rebuild the ID map
    if (arr !== lastArrayRef.current && arr.length !== lastArrayRef.current.length) {
      // Keep existing IDs for indices that still exist
      const newMap = new Map<number, string>();
      for (let i = 0; i < arr.length; i++) {
        const existingId = idMapRef.current.get(i);
        if (existingId !== undefined) {
          newMap.set(i, existingId);
        }
      }
      idMapRef.current = newMap;
      lastArrayRef.current = arr;
    }

    const existing = idMapRef.current.get(index);
    if (existing !== undefined) return existing;

    const newId = `field-array-${idCounterRef.current++}`;
    idMapRef.current.set(index, newId);
    return newId;
  }, []);

  // Reassign IDs after a mutation to keep indices in sync
  const reassignIds = useCallback((newArr: any[], idOrder: string[]) => {
    const newMap = new Map<number, string>();
    for (let i = 0; i < idOrder.length; i++) {
      newMap.set(i, idOrder[i]);
    }
    idMapRef.current = newMap;
    lastArrayRef.current = newArr;
  }, []);

  // Build current ID list
  const currentIds = useMemo(() => {
    return currentArray.map((_, i) => getStableId(i, currentArray));
  }, [currentArray, getStableId]);

  // ── Mutation methods ──

  const setArray = useCallback(
    (newArr: any[], newIds: string[]) => {
      reassignIds(newArr, newIds);
      form.setFieldValue(name, newArr as any);
    },
    [form, name, reassignIds],
  );

  const append = useCallback(
    (item: any) => {
      const newId = `field-array-${idCounterRef.current++}`;
      const newArr = [...currentArray, item];
      setArray(newArr, [...currentIds, newId]);
    },
    [currentArray, currentIds, setArray],
  );

  const prepend = useCallback(
    (item: any) => {
      const newId = `field-array-${idCounterRef.current++}`;
      const newArr = [item, ...currentArray];
      setArray(newArr, [newId, ...currentIds]);
    },
    [currentArray, currentIds, setArray],
  );

  const remove = useCallback(
    (index: number) => {
      const newArr = currentArray.filter((_, i) => i !== index);
      const newIds = currentIds.filter((_, i) => i !== index);
      setArray(newArr, newIds);
    },
    [currentArray, currentIds, setArray],
  );

  const move = useCallback(
    (from: number, to: number) => {
      if (from === to) return;
      const newArr = [...currentArray];
      const newIds = [...currentIds];
      const [movedItem] = newArr.splice(from, 1);
      const [movedId] = newIds.splice(from, 1);
      newArr.splice(to, 0, movedItem);
      newIds.splice(to, 0, movedId);
      setArray(newArr, newIds);
    },
    [currentArray, currentIds, setArray],
  );

  const swap = useCallback(
    (indexA: number, indexB: number) => {
      if (indexA === indexB) return;
      const newArr = [...currentArray];
      const newIds = [...currentIds];
      [newArr[indexA], newArr[indexB]] = [newArr[indexB], newArr[indexA]];
      [newIds[indexA], newIds[indexB]] = [newIds[indexB], newIds[indexA]];
      setArray(newArr, newIds);
    },
    [currentArray, currentIds, setArray],
  );

  const insert = useCallback(
    (index: number, item: any) => {
      const newId = `field-array-${idCounterRef.current++}`;
      const newArr = [...currentArray];
      const newIds = [...currentIds];
      newArr.splice(index, 0, item);
      newIds.splice(index, 0, newId);
      setArray(newArr, newIds);
    },
    [currentArray, currentIds, setArray],
  );

  const replace = useCallback(
    (index: number, item: any) => {
      const newArr = [...currentArray];
      newArr[index] = item;
      // Keep the same ID for replaced items
      setArray(newArr, [...currentIds]);
    },
    [currentArray, currentIds, setArray],
  );

  const clear = useCallback(() => {
    setArray([], []);
  }, [setArray]);

  // ── Build fields with getFieldProps ──

  const fields: FieldArrayItem[] = useMemo(() => {
    return currentArray.map((value, index) => {
      const id = currentIds[index];

      const getFieldProps = (subField: string) => {
        const fieldName = `${String(name)}.${index}.${subField}`;
        const subValue =
          value !== null && typeof value === "object" ? value[subField] : undefined;

        return {
          value: subValue,
          onChange: (e: any) => {
            const newVal = extractValue(e);
            const newArr = [...currentArray];
            if (newArr[index] !== null && typeof newArr[index] === "object") {
              newArr[index] = { ...newArr[index], [subField]: newVal };
            } else {
              newArr[index] = newVal;
            }
            form.setFieldValue(name, newArr as any);
          },
          onBlur: () => {
            form.setFieldTouched(name, true);
          },
          name: fieldName,
        };
      };

      return { id, value, index, getFieldProps };
    });
  }, [currentArray, currentIds, name, form]);

  return {
    fields,
    append,
    prepend,
    remove,
    move,
    swap,
    insert,
    replace,
    clear,
  };
}
