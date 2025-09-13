import { TalkMateLogo } from '@/components/talk-mate-logo';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 bg-card shadow-md">
      <div className="flex items-center gap-4 container mx-auto">
        <TalkMateLogo className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-extrabold font-headline text-foreground tracking-tight">
          TalkMate
        </h1>
      </div>
    </header>
  );
}
