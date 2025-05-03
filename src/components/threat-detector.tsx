// 'use client'; // This component might not be needed directly on the dashboard anymore

// import { useState, useCallback } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from '@/components/ui/card';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { analyzeNetworkThreats, type AnalyzeNetworkThreatsOutput } from '@/ai/flows/analyze-threats';
// import { useToast } from '@/hooks/use-toast';
// import { ShieldAlert, FileScan, ListChecks, Loader2, AlertTriangle } from 'lucide-react';
// import type { NetworkDevice } from '@/types';

// interface ThreatDetectorProps {
//   devices: NetworkDevice[];
// }

// export function ThreatDetector({ devices }: ThreatDetectorProps) {
//   const [analysisResult, setAnalysisResult] = useState<AnalyzeNetworkThreatsOutput | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { toast } = useToast();

//   const handleAnalyze = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     setAnalysisResult(null); // Clear previous results

//     try {
//       // Prepare network data as a JSON string
//       const networkData = JSON.stringify(devices, null, 2); // Pretty print JSON

//       if (!networkData || devices.length === 0) {
//         setError('No network data available to analyze.');
//         toast({
//            title: 'Analysis Skipped',
//            description: 'No devices detected to analyze.',
//            variant: 'destructive',
//          });
//         setIsLoading(false);
//         return;
//       }

//       const result = await analyzeNetworkThreats({ networkData });
//       setAnalysisResult(result);
//       toast({
//         title: 'Analysis Complete',
//         description: 'Network threat analysis finished successfully.',
//       });
//     } catch (err) {
//       console.error('Threat analysis failed:', err);
//       setError('Failed to analyze network threats. Please try again.');
//        toast({
//          title: 'Analysis Failed',
//          description: 'An error occurred during threat analysis.',
//          variant: 'destructive',
//        });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [devices, toast]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <ShieldAlert className="h-6 w-6 text-primary" />
//           AI Threat Detection
//         </CardTitle>
//         <CardDescription>Analyze network traffic for potential security threats and anomalies.</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {isLoading && (
//           <div className="flex items-center justify-center space-x-2 text-muted-foreground">
//             <Loader2 className="h-5 w-5 animate-spin" />
//             <span>Analyzing network data...</span>
//           </div>
//         )}

//         {error && (
//            <Alert variant="destructive">
//              <AlertTriangle className="h-4 w-4" />
//              <AlertTitle>Error</AlertTitle>
//              <AlertDescription>{error}</AlertDescription>
//            </Alert>
//         )}

//         {analysisResult && !isLoading && (
//           <div className="space-y-4">
//              <Alert>
//                <FileScan className="h-4 w-4" />
//                <AlertTitle>Analysis Summary</AlertTitle>
//                <AlertDescription>{analysisResult.summary || 'No summary provided.'}</AlertDescription>
//              </Alert>

//             {analysisResult.threats && analysisResult.threats.length > 0 && (
//               <Alert variant="destructive">
//                 <ShieldAlert className="h-4 w-4" />
//                 <AlertTitle>Potential Threats Detected</AlertTitle>
//                 <AlertDescription>
//                   <ul className="list-disc pl-5 space-y-1">
//                     {analysisResult.threats.map((threat, index) => (
//                       <li key={`threat-${index}`}>{threat}</li>
//                     ))}
//                   </ul>
//                 </AlertDescription>
//               </Alert>
//             )}

//             {analysisResult.anomalies && analysisResult.anomalies.length > 0 && (
//               <Alert>
//                  <ListChecks className="h-4 w-4" />
//                  <AlertTitle>Anomalies Detected</AlertTitle>
//                  <AlertDescription>
//                    <ul className="list-disc pl-5 space-y-1">
//                      {analysisResult.anomalies.map((anomaly, index) => (
//                        <li key={`anomaly-${index}`}>{anomaly}</li>
//                      ))}
//                    </ul>
//                  </AlertDescription>
//                </Alert>
//             )}

//              {(analysisResult.threats?.length === 0 && analysisResult.anomalies?.length === 0) && (
//                  <Alert>
//                     <ShieldAlert className="h-4 w-4" />
//                     <AlertTitle>No Issues Found</AlertTitle>
//                     <AlertDescription>The analysis did not find any significant threats or anomalies based on the provided data.</AlertDescription>
//                   </Alert>
//              )}
//           </div>
//         )}
//       </CardContent>
//       <CardFooter>
//         <Button onClick={handleAnalyze} disabled={isLoading || devices.length === 0} className="w-full">
//           {isLoading ? (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           ) : (
//             <FileScan className="mr-2 h-4 w-4" />
//           )}
//           Analyze Network Threats
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }
