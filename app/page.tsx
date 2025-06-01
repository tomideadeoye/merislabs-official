import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Meris Labs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Journal</CardTitle>
            <CardDescription>Write and view journal entries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Record your thoughts and reflections in a journal that's stored in memory.</p>
            <Link href="/journal">
              <Button>Open Journal</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Memory Explorer</CardTitle>
            <CardDescription>Search and explore your memory</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Search through your memory and add new memories of different types.</p>
            <Link href="/memory-explorer">
              <Button>Explore Memory</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Opportunities</CardTitle>
            <CardDescription>Manage and evaluate opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Track and evaluate job opportunities, projects, and more.</p>
            <Link href="/opportunities">
              <Button>View Opportunities</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}