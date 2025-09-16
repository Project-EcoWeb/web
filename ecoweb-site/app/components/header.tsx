import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary"></div>
                        <span className="text-xl font-bold text-primary">EcoWeb</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="#solutions"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Solutions
                        </Link>
                        <Link href="#impact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            Impact
                        </Link>
                        <Link
                            href="#success-stories"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Success Stories
                        </Link>
                        <Link href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            Contact
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/register">Register Company</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
