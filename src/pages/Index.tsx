import { useState, useEffect } from "react";
import { Moon, Sun, ArrowRight, ExternalLink, Mail, MapPin, Phone, Linkedin, Github, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RSS_URL = "https://akwijayanto.com/feeds/posts/default?alt=rss";
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

const Index = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("blog-theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    const fetchRSS = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));
        if (!response.ok) throw new Error("Network response was not ok");
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        
        const items = xml.querySelectorAll("item");
        let fetchedPosts: BlogPost[] = [];

        if (items.length === 0) {
          const entries = xml.querySelectorAll("entry");
          fetchedPosts = Array.from(entries).slice(0, 5).map((entry) => ({
            title: entry.querySelector("title")?.textContent || "No Title",
            link: entry.querySelector("link[rel='alternate']")?.getAttribute("href") || entry.querySelector("link")?.getAttribute("href") || "",
            pubDate: entry.querySelector("published")?.textContent || entry.querySelector("updated")?.textContent || new Date().toISOString(),
            description: entry.querySelector("content")?.textContent || entry.querySelector("summary")?.textContent || "",
          }));
        } else {
          fetchedPosts = Array.from(items).slice(0, 5).map((item) => ({
            title: item.querySelector("title")?.textContent || "No Title",
            link: item.querySelector("link")?.textContent || "",
            pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
            description: item.querySelector("description")?.textContent || "",
          }));
        }
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("RSS Fetch Error:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRSS();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("blog-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex flex-col">
            <a href="/" className="font-bold text-lg">Arif K Wijayanto</a>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">Geospatial Research & Insights</span>
          </div>
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#research" className="hover:text-primary transition-colors">Research</a>
              <a href="#publications" className="hover:text-primary transition-colors">Publications</a>
              <a href="https://akwijayanto.com" className="hover:text-primary transition-colors">Blog</a>
            </div>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-12 space-y-24">
        {/* Hero */}
        <section id="home" className="flex flex-col items-center text-center space-y-6 pt-12 pb-24 border-b">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold border">
            AK
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Dr. Arif K Wijayanto, M.Sc</h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Lecturer & Researcher specializing in Geospatial Technology, UAV/Drones, Remote Sensing, and GIS.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <a href="https://akwijayanto.com">Visit My Blog <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
        </section>

        {/* Blog Posts from RSS */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Latest from akwijayanto.com</h2>
            <a href="https://akwijayanto.com" className="text-xs text-primary hover:underline flex items-center">
              View All <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardHeader>
                    <div className="h-4 w-1/4 bg-muted mb-2" />
                    <div className="h-6 w-3/4 bg-muted" />
                  </CardHeader>
                </Card>
              ))
            ) : isError ? (
              <p className="text-destructive">Error loading blog posts. Please check <a href="https://akwijayanto.com" className="underline">my blog</a> directly.</p>
            ) : (
              posts?.map((post, i) => (
                <Card key={i} className="group hover:border-primary transition-all duration-300">
                  <CardHeader>
                    <CardDescription className="font-mono text-[10px] uppercase">{new Date(post.pubDate).toLocaleDateString()}</CardDescription>
                    <CardTitle className="leading-tight group-hover:text-primary transition-colors">
                      <a href={post.link} target="_blank" rel="noopener noreferrer">{post.title}</a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.description.replace(/<[^>]*>/g, '')}
                    </p>
                    <a href={post.link} className="text-xs font-semibold flex items-center text-primary group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* About */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold border-b pb-2">About Me</h2>
            <p className="text-muted-foreground">
              I am a quantitative spatial analyst with expertise in remote sensing, spatial statistics, and algorithm development. My research focuses on developing and validating computational methods for the analysis of multi-scalar spatial data, aimed at addressing complex environmental challenges with empirical rigor.
            </p>
            <p className="text-muted-foreground">
              Combining core principles of geography with modern spatial intelligence, my work emphasizes reproducibility, robust statistical modeling, and evidence-based synthesis in geographic information science.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Remote Sensing", desc: "Multispectral image processing" },
              { title: "Geocomputation", desc: "Advanced spatial topology" },
              { title: "Spatial Statistics", desc: "Geostatistics & modeling" },
              { title: "Env. Modeling", desc: "Systematic resilience modeling" },
            ].map((item, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-1">
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Research */}
        <section id="research" className="space-y-8">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold border-b pb-2">Research Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Environmental Parameterization", desc: "Applying multi-temporal earth observation algorithms to quantify biophysical dynamics, biomass flux, and ecological integrity." },
              { title: "Urban Spatial Morphology", desc: "Employing robust spatial analytics to model urban sprawl trajectories, land-cover transition probabilities, and geometric sprawl indices." },
              { title: "Spatial Climatology", desc: "Synthesizing spatial downscaling of climate datasets to analyze localized meteorological anomalies and map multidimensional vulnerabilities." },
              { title: "Hydro-Spatial Modeling", desc: "Integrating hydrological equations with DEM-derived spatial parameters to systematically model watershed delineation and flow dynamics." },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-8">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold border-b pb-2">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2 border rounded-full"><Mail className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">Email</p>
                  <p className="text-sm">arif.k.wijayanto@example.edu</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 border rounded-full"><MapPin className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">Office</p>
                  <p className="text-sm">Spatial Data Science Lab, Department of Geoinformatics</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 border rounded-full"><Phone className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">Phone</p>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Social & Academic Networks</h4>
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center gap-2 text-xs hover:text-primary transition-colors"><Linkedin className="h-3 w-3" /> LinkedIn</a>
                <a href="#" className="flex items-center gap-2 text-xs hover:text-primary transition-colors"><Github className="h-3 w-3" /> GitHub</a>
                <a href="#" className="flex items-center gap-2 text-xs hover:text-primary transition-colors"><GraduationCap className="h-3 w-3" /> Google Scholar</a>
                <a href="#" className="flex items-center gap-2 text-xs hover:text-primary transition-colors flex-nowrap"><span className="w-3 h-3 border rounded-full flex items-center justify-center text-[8px] font-bold">i</span> ORCID</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 mt-24">
        <div className="container text-center space-y-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Arif K Wijayanto. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
