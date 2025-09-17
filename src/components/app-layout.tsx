'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Feather, FileText, Bot, UserSquare, Music, BookText } from 'lucide-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getTitle = () => {
    switch (pathname) {
      case '/':
        return 'Poetry Muse';
      case '/script-analyzer':
        return 'Script Analyzer';
      case '/character-generator':
        return 'Character Generator';
      case '/songwriters-assistant':
        return "Songwriter's Assistant";
      case '/story-plot-generator':
        return 'Story Plot Generator';
      default:
        return 'MuseCraft AI';
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/">
                    <Bot className="size-5" />
                </Link>
            </Button>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <h2 className="text-lg font-semibold tracking-tight">MuseCraft AI</h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/'} tooltip={{children: 'Poetry Muse'}}>
                <Link href="/">
                  <Feather />
                  <span>Poetry Muse</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/script-analyzer'} tooltip={{children: 'Script Analyzer'}}>
                <Link href="/script-analyzer">
                  <FileText />
                  <span>Script Analyzer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/character-generator'} tooltip={{children: 'Character Generator'}}>
                <Link href="/character-generator">
                  <UserSquare />
                  <span>Character Generator</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/songwriters-assistant'} tooltip={{children: 'Songwriter\'s Assistant'}}>
                <Link href="/songwriters-assistant">
                  <Music />
                  <span>Songwriter's Assistant</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/story-plot-generator'} tooltip={{children: 'Story Plot Generator'}}>
                <Link href="/story-plot-generator">
                  <BookText />
                  <span>Story Plot</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/1920/1080?blur=10&grayscale=10')"}} data-ai-hint="dreamy landscape trees">
        <header className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-10">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h1 className="text-lg font-semibold">
                  {getTitle()}
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
