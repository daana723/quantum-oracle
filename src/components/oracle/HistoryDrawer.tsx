import React from "react";
import { format } from "date-fns";
import { X, Trash2 } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Reading } from "@/hooks/useReadingHistory";

interface HistoryDrawerProps {
  readings: Reading[];
  onDeleteReading: (id: string) => void;
  onClearAll: () => void;
  children: React.ReactNode;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  readings,
  onDeleteReading,
  onClearAll,
  children,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-card border-gold/30 max-h-[85vh]">
        <DrawerHeader className="border-b border-gold/20">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-display text-lg text-gold tracking-wider">
              Past Observations
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="text-gold/60 hover:text-gold">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 py-4">
          {readings.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground italic">
                No readings yet. Your observations will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {readings.map((reading) => (
                <div
                  key={reading.id}
                  className="p-4 rounded-lg border border-gold/20 bg-background/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-display text-base text-gold">
                        {reading.primaryCard.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        {format(new Date(reading.timestamp), "MMM d, yyyy · h:mm a")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteReading(reading.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {(reading.intent || reading.customIntent) && (
                    <p className="text-sm text-gold/60 font-body italic">
                      Intent: {reading.customIntent || reading.intent}
                    </p>
                  )}

                  <p className="text-sm text-foreground/80 font-body line-clamp-3">
                    {reading.primaryCard.meaning}
                  </p>

                  {reading.echoCards.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      <span className="text-xs text-muted-foreground">Echoes:</span>
                      {reading.echoCards.map((echo) => (
                        <span
                          key={echo.id}
                          className="text-xs text-gold/50 font-body"
                        >
                          {echo.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {readings.length > 0 && (
          <div className="p-4 border-t border-gold/20">
            <Button
              variant="outline"
              onClick={onClearAll}
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              Clear All Readings
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default HistoryDrawer;
