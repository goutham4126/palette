import { getDetailsforProject } from "@/app/actions/market";
import Image from "next/image";
import {getDetailsforCreator} from "@/app/actions/manual"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, User, Code2, ShoppingCart, CalendarDays, FileText,Coins } from "lucide-react";
import RazorpayPayment from "@/components/purchase";
import { checkProjectPurchasedByUser } from "@/app/actions/purchase";

async function Page({ params }) {
  const project = await getDetailsforProject(await(params).id);
  const creator = await getDetailsforCreator(project.creatorId);
  const isPurchased = await checkProjectPurchasedByUser(project.id);
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-background to-muted/10 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {project.title}
          </h1>
          {project.price && (
            <Badge className="px-6 py-2 text-lg bg-green-600 hover:bg-green-700">
              <Coins className="w-5 h-5 mr-2" />
              <span>₹</span>{project.price.toFixed(2)}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          {creator && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Image
                  src={creator.imageUrl || '/default-avatar.jpg'}
                  alt={creator.name || 'Creator'}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-primary shadow-lg"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <p className="font-medium text-foreground">
                {creator.name || 'Anonymous Creator'}
              </p>
            </div>
          )}
          <span className="text-foreground/50">•</span>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span>Listed {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Preview */}
          {project.thumbnail && (
            <Card className="overflow-hidden group">
              <div className="relative h-64 bg-muted">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Card>
          )}

          {/* Details Section */}
          {project.details && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Project Details</h2>
                </div>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                {project.details}
              </CardContent>
            </Card>
          )}


        {
            isPurchased && (
          <div className="space-y-6">
            {project.htmlCode && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-6 h-6 text-primary" />
                      <h3 className="font-mono text-lg">HTML</h3>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 rounded-lg bg-gray-900 overflow-x-auto">
                    <code className="text-sm text-green-400">{project.htmlCode}</code>
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Similar Cards for CSS and JS */}
            {project.cssCode && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-6 h-6 text-primary" />
                      <h3 className="font-mono text-lg">CSS</h3>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 rounded-lg bg-gray-900 overflow-x-auto">
                    <code className="text-sm text-blue-400">{project.cssCode}</code>
                  </pre>
                </CardContent>
              </Card>
            )}

            {project.jsCode && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-6 h-6 text-primary" />
                      <h3 className="font-mono text-lg">JavaScript</h3>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 rounded-lg bg-gray-900 overflow-x-auto">
                    <code className="text-sm text-yellow-400">{project.jsCode}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
            )
          } 
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Purchase Section */}
          <Card className="sticky top-8">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="text-2xl font-bold text-primary">
                <span>₹</span>{project.price?.toFixed(2)}
                </span>
              </div>
              <RazorpayPayment 
                  amount={project.price} 
                  productName={project.title}
                  creator={creator}
                  templateId={project.id}
                  isPurchased={isPurchased}
                />
              <div className="text-sm text-muted-foreground text-center">
                Secure transaction · Instant delivery
              </div>
            </CardContent>
          </Card>

          {/* Collaborators */}
          {project.collaborators?.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  <h2 className="text-lg font-semibold">Collaborators</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.collaborators.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <Image
                      src={c.imageUrl || '/default-avatar.jpg'}
                      alt={c.email}
                      width={32}
                      height={32}
                      className="rounded-full border"
                    />
                    <div>
                      <p className="font-medium">{c.email}</p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {c.accessType.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Purchase History */}
          {project.purchases?.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <h2 className="text-lg font-semibold">Purchase History</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.purchases.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Image
                      src={p.buyer.imageUrl || '/default-avatar.jpg'}
                      alt={p.buyer.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-primary"
                    />
                    <div>
                      <p className="font-medium">{p.buyer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(p.purchasedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;