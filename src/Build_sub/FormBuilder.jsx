import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import FieldWrapper from "./FieldWrapper";
import FieldRenderer from "./FieldRenderer";

const SortableField = ({ field, onRemoveField, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FieldWrapper field={field} onRemove={onRemoveField}>
        {children}
      </FieldWrapper>
    </div>
  );
};

const FormBuilder = ({
  fields,
  onRemoveField,
  onUpdateField,
  onAddOption,
  onRemoveOption,
  setFields,
}) => {
  const navigator = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over?.id);
      setFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg col-span-1 max-h-[600px] overflow-y-auto">
      {fields.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No fields added yet
        </div>
      ) : (
        <div className="">
          {/* <button
            onClick={() => {
              localStorage.setItem('formData', JSON.stringify(fields));
              navigator('/settings');
            }}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Finished
          </button> */}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, idx) => (
            <SortableField
              key={field.id}
              field={field}
              onRemoveField={onRemoveField}
            >
              <FieldRenderer
                field={field}
                onUpdateField={onUpdateField}
                onRemoveOption={onRemoveOption}
                onAddOption={onAddOption}
              />
            </SortableField>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default FormBuilder;
