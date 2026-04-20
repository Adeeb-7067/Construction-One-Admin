import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { sidebarConfig, type SidebarEntry, type SidebarGroup } from "@/config/sidebar-config";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

function isGroup(entry: SidebarEntry): entry is SidebarGroup {
  return "items" in entry;
}

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="sr-only">
        <DialogTitle>Command Menu</DialogTitle>
        <DialogDescription>Search for pages and routes</DialogDescription>
      </div>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {sidebarConfig.map((entry) => {
          if (!isGroup(entry)) {
            return (
              <CommandGroup key={entry.title} heading="General">
                <CommandItem
                  onSelect={() => runCommand(() => navigate(entry.url))}
                  className="gap-2"
                  value={`${entry.title}`}
                >
                  <entry.icon className="mr-2 h-4 w-4" />
                  <span>{entry.title}</span>
                </CommandItem>
              </CommandGroup>
            );
          }

          return (
            <CommandGroup key={entry.title} heading={entry.title}>
              {entry.items.map((item) => (
                <CommandItem
                  key={item.url}
                  onSelect={() => runCommand(() => navigate(item.url))}
                  className="gap-2"
                  value={`${entry.title} ${item.title}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
      <div className="flex items-center gap-4 border-t bg-muted/50 px-4 py-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px] border shadow-sm">↑↓</kbd>
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px] border shadow-sm">↵</kbd>
          <span>Select</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px] border shadow-sm">Esc</kbd>
          <span>Close</span>
        </div>
      </div>
    </CommandDialog>
  );
}
