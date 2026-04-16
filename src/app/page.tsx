import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrchestratorDemo } from '@/components/agents/OrchestratorDemo';
import { AnalyticsDemo } from '@/components/agents/AnalyticsDemo';
import { ReportDemo } from '@/components/agents/ReportDemo';
import { Separator } from '@/components/ui/separator';
import { AppLayout } from '@/components/layout/AppLayout';

export default function Home() {
  return (
    <AppLayout>
      <div className="p-8" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-normal mb-2" style={{ fontFamily: 'Coolvetica, sans-serif' }}>Multi-Agent AI Demo</h1>
          <p className="text-gray-600 mb-4 text-lg">Gemini + Firebolt MCP + Gmail (sandbox) • Next.js 14</p>
          
          {/* Setup Guide Banner */}
          
          
          <Tabs defaultValue="orchestrator" className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orchestrator">Orchestrator</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="workshop">Workshop</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orchestrator" className="mt-6">
              <OrchestratorDemo />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <AnalyticsDemo />
            </TabsContent>
            
            <TabsContent value="report" className="mt-6">
              <ReportDemo />
            </TabsContent>
            
            <TabsContent value="workshop" className="mt-6">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold mb-4">Interactive Workshop</h2>
                <p className="mb-6 text-lg text-gray-600">
                  Head to the interactive workshop to complete the TODOs and extend the multi-agent system with hands-on exercises.
                </p>
                <Link 
                  href="/workshop" 
                  className="inline-block px-6 py-3 bg-[#7AD2A2] hover:bg-[#69c190] text-[#1e1f22] rounded-lg font-medium transition-colors"
                >
                  Go to Workshop →
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="links" className="mt-6">
              <div className="max-w-3xl space-y-4">
                <h2 className="text-2xl font-semibold mb-2">Useful Links</h2>
                <p className="mb-4 text-gray-600">Quick access to workshop resources and feedback forms.</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <a href="https://ln.run/SqyHF" target="_blank" rel="noreferrer" className="p-4 rounded-lg border hover:shadow-md transition-shadow bg-white">
                    <h3 className="font-semibold">Replit Workshop (Test)</h3>
                    <span className="sr-only">https://ln.run/SqyHF</span>
                  </a>

                  <a href="https://ln.run/ZQ2M_" target="_blank" rel="noreferrer" className="p-4 rounded-lg border hover:shadow-md transition-shadow bg-white">
                    <h3 className="font-semibold">Replit Workshop (Exercises)</h3>
                    <span className="sr-only">https://ln.run/ZQ2M_</span>
                  </a>

                  <a href="https://ln.run/Qv9f6" target="_blank" rel="noreferrer" className="p-4 rounded-lg border hover:shadow-md transition-shadow bg-white">
                    <h3 className="font-semibold">Online Challenge</h3>
                    <span className="sr-only">https://ln.run/Qv9f6</span>
                  </a>

                  <a href="https://chat.whatsapp.com/JHnKKc61fsg7LHEBiO6QbH" target="_blank" rel="noreferrer" className="p-4 rounded-lg border hover:shadow-md transition-shadow bg-white">
                    <h3 className="font-semibold">Join DevRelSquad Community</h3>
                    <span className="sr-only">WhatsApp invite link</span>
                  </a>

                  <a href="https://ln.run/g7juZ" target="_blank" rel="noreferrer" className="p-4 rounded-lg border hover:shadow-md transition-shadow bg-white">
                    <h3 className="font-semibold">Deployed Agentic App</h3>
                    <span className="sr-only">https://ln.run/g7juZ</span>
                  </a>

                  <a href="https://www.goavo.ai/events/forms/fillup?id=6901becf73e7ff29bc3dbf86" target="_blank" rel="noreferrer" className="p-4 rounded-lg border hover:shadow-md transition-shadow bg-white">
                    <h3 className="font-semibold">Multi-Agent AI Workshop feedback form</h3>
                    <span className="sr-only">Multi-Agent AI Workshop feedback form</span>
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}