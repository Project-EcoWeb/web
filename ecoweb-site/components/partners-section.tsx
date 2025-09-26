import { Card } from "components/ui/card"
import { Button } from "components/ui/button"
import { Quote } from "lucide-react"
import Link from "next/link"

export function PartnersSection() {
    const successStory = {
        companyName: "GreenTech Industries",
        material: "electronic components",
        project: "educational technology kits",
        community: "local schools and maker spaces",
        impact:
            "Provided technology access to over 500 students while diverting 2.3 tons of electronic waste from landfills.",
        logo: "/logo.png",
        image: "/logo.png",
    }

    const partnerLogos = [
        "",
    ]

    return (
        <section id="success-stories" className="py-16 lg:py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                        Trust from Companies that Lead by Example
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Join industry leaders who are already transforming their waste into positive social impact.
                    </p>
                </div>

                {/* Partner Logos */}
                <div className="mb-16">
                    <p className="text-center text-sm font-medium text-muted-foreground mb-8">
                        Trusted by forward-thinking organizations
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
                        {partnerLogos.map((logo, index) => (
                            <img
                                key={index}
                                src={logo || "/logo.jpg"}
                                alt={`Partner ${index + 1}`}
                                className="h-10 w-auto grayscale hover:grayscale-0 transition-all"
                            />
                        ))}
                    </div>
                </div>

                {/* Success Story */}
                <Card className="p-8 border-border bg-background max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={successStory.logo || "//logo.png"}
                                    alt={`${successStory.companyName} logo`}
                                    className="h-12 w-auto"
                                />
                                <Quote className="h-8 w-8 text-primary" />
                            </div>

                            <h3 className="text-xl font-semibold text-foreground mb-4">
                                Transforming Waste into Educational Opportunity
                            </h3>

                            <p className="text-muted-foreground leading-relaxed mb-6">
                                How <span className="font-medium text-foreground">{successStory.companyName}</span> transformed their{" "}
                                <span className="font-medium text-primary">{successStory.material}</span> waste into{" "}
                                <span className="font-medium text-secondary">{successStory.project}</span>, benefiting{" "}
                                <span className="font-medium text-foreground">{successStory.community}</span>.
                            </p>

                            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                                <strong className="text-foreground">Impact:</strong> {successStory.impact}
                            </p>
                        </div>

                        <div className="relative">
                            <img
                                src={successStory.image || "//logo.png"}
                                alt="Success story impact"
                                className="rounded-lg w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                        </div>
                    </div>
                </Card>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="#contact">Become Our Next Success Story</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
