import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PdfPage {
  pdfIndex: number;
  pageIndex: number;
  previewUrl: string;
}

interface PdfPagePreviewProps {
  pages: PdfPage[];
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  onRemovePage: (pageIndex: number) => void;
  isLoading: boolean;
}

function SortablePageItem({
  page,
  index,
  onRemove,
  isDisabled,
}: {
  page: PdfPage;
  index: number;
  onRemove: () => void;
  isDisabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `${page.pdfIndex}-${page.pageIndex}`,
      disabled: isDisabled,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="w-[120px] h-[160px] border rounded-md overflow-hidden bg-white">
        <img
          src={page.previewUrl}
          alt={`Page ${page.pageIndex + 1}`}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-0 right-0 ">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 "
            onClick={onRemove}
            disabled={isDisabled}
          >
            <X className="h-4 w-4 " />
          </Button>
        </div>
        <div
          {...attributes}
          {...listeners}
          className="absolute bottom-5 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
        >
          <GripVertical className="h-3 w-3 inline-block mr-1" />
          Drag to reorder
        </div>
      </div>
      <div className="mt-1 text-xs text-center">Page {page.pageIndex + 1}</div>
    </div>
  );
}

export function PdfPagePreview({
  pages,
  onReorder,
  onRemovePage,
  isLoading,
}: PdfPagePreviewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const activeIndex = pages.findIndex(
        (page) => `${page.pdfIndex}-${page.pageIndex}` === activeId
      );
      const overIndex = pages.findIndex(
        (page) => `${page.pdfIndex}-${page.pageIndex}` === overId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        onReorder(activeIndex, overIndex);
      }
    }
  }

  return (
    <div className="w-full">
      <h3 className="font-medium mb-2">Page Order (Drag to rearrange)</h3>

      {pages.length === 0 ? (
        <div className="text-center p-4 border rounded-lg">
          <p className="text-muted-foreground">No PDF pages to display</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pages.map((page) => `${page.pdfIndex}-${page.pageIndex}`)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-4 p-4 border rounded-lg min-h-[200px]">
              {pages.map((page, index) => (
                <SortablePageItem
                  key={`${page.pdfIndex}-${page.pageIndex}`}
                  page={page}
                  index={index}
                  onRemove={() => onRemovePage(index)}
                  isDisabled={isLoading}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
