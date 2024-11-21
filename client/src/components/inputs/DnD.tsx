import React, { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, SxProps } from "@mui/material";

interface DnDProps {
  ids: string[];
  setIds: (ids: string[]) => void;
  renderItem: (id: string) => React.ReactNode;
  containerSx?: SxProps;
  sensors?: SensorDescriptor<SensorOptions>[];
}

const SortableItem: React.FC<{
  id: string;
  renderItem: (id: string) => React.ReactNode;
}> = ({ id, renderItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = useMemo(
    () => ({
      touchAction: "none",
      transform: CSS.Transform.toString(transform),
      transition,
    }),
    [transform, transition]
  );

  return (
    <Box ref={setNodeRef} {...attributes} {...listeners} sx={style}>
      {renderItem(id)}
    </Box>
  );
};

const DnD: React.FC<DnDProps> = ({ ids, setIds, renderItem, containerSx, sensors }) => {
  const defaultSensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const activeSensors = useMemo(() => sensors || defaultSensors, [sensors, defaultSensors]);

  const cachedRenderItem = useMemo(() => {
    const cache: Record<string, React.ReactNode> = {};
    return (id: string) => {
      if (!cache[id]) {
        cache[id] = renderItem(id);
      }
      return cache[id];
    };
  }, [renderItem]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over?.id! as string);
      setIds(arrayMove(ids, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={activeSensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <Box sx={containerSx}>
          {ids.map((id) => (
            <SortableItem key={id} id={id} renderItem={cachedRenderItem} />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
};

export default DnD;
