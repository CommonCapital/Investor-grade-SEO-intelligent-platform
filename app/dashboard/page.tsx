'use client'
import { initiateLLM } from '@/actions/initialeLLM'
import CountrySelector from '@/components/CountrySelector/CountrySelector'
import ReportsTable from '@/components/ReportsTable/ReportsTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Authenticated, AuthLoading } from 'convex/react'
import { BarChart3, FileText, Loader2, Plus, Search, Sparkles } from 'lucide-react'
import { Prompt } from 'next/font/google'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Dashboard = () => {
    const [prompt, setPrompt] = useState('')
  const [country, setCountry] = useState('US')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!prompt || isLoading) return
    setIsLoading(true)

    try {
      console.log('Generating report for:', prompt, country)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // router.push(`/dashboard/report/${snapshotId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className='min-h-screen bg-white pt-24'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='space-y-12'>
          {/* Generate Report Card */}
          <Card className='border-2 border-black/10 shadow-none'>
            <CardHeader className='text-center pb-8 border-b border-black/5'>
              <CardTitle className='text-3xl font-light tracking-tight mb-3'>
                Generate SEO Report
              </CardTitle>
              <CardDescription className='text-base font-light text-black/70 max-w-2xl mx-auto leading-relaxed'>
                Enter any public company name to generate comprehensive search visibility analysis
              </CardDescription>
            </CardHeader>
            
            <CardContent className='pt-8'>
              <div className='space-y-6'>
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='flex-1 relative'>
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder='Company name (e.g., Tesla, Apple, Microsoft)'
                      className='h-12 text-base border-2 border-black/10 focus:border-black bg-white transition-all duration-300 font-light'
                      disabled={isLoading}
                    />
                  </div>
                  
                  <CountrySelector
                    value={country}
                    onValueChange={setCountry}
                    disabled={isLoading}
                  />
                  
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className='h-12 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-xs tracking-widest uppercase font-normal w-full md:w-auto'
                    disabled={isLoading || !prompt.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        <span className='hidden md:inline'>Generating...</span>
                        <span className='md:hidden'>Loading</span>
                      </>
                    ) : (
                      <>
                        <Search className='w-4 h-4 mr-2' />
                        <span className='hidden md:inline'>Generate Report</span>
                        <span className='md:hidden'>Generate</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className='flex flex-wrap justify-center gap-6 pt-6 border-t border-black/5'>
                  <div className='flex items-center gap-2 text-xs tracking-wider uppercase text-black/60'>
                    <div className='w-1.5 h-1.5 rounded-full bg-black'></div>
                    <span>Real-Time Data</span>
                  </div>
                  <div className='flex items-center gap-2 text-xs tracking-wider uppercase text-black/60'>
                    <div className='w-1.5 h-1.5 rounded-full bg-black'></div>
                    <span>AI Analysis</span>
                  </div>
                  <div className='flex items-center gap-2 text-xs tracking-wider uppercase text-black/60'>
                    <div className='w-1.5 h-1.5 rounded-full bg-black'></div>
                    <span>Export Ready</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Section */}
          <Card className='border-2 border-black/10 shadow-none'>
            <CardHeader className='border-b border-black/5'>
              <div className='flex items-center gap-3'>
                <BarChart3 className='w-5 h-5' />
                <CardTitle className='text-2xl font-light tracking-tight'>Recent Reports</CardTitle>
              </div>
              <CardDescription className='text-sm font-light text-black/70'>
                Your generated SEO analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-6'>
              <Authenticated>
                <ReportsTable />
              </Authenticated>
              <AuthLoading>
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='w-6 h-6 animate-spin' />
                </div>
              </AuthLoading>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard