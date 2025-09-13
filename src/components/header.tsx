import { TalkMateLogo } from '@/components/talk-mate-logo';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b bg-card">
      <div className="flex items-center gap-3 container mx-auto">
        <TalkMateLogo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          TalkMate
        </h1>
      </div>
    </header>
  );
}
