"use client";

import type { UserExerciseData } from '@/lib/data';
import { EXERCISES, Exercise } from '@/lib/constants';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig
} from "@/components/ui/chart";
import {
    Radar,
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis, // This import is still needed by the library types
} from "recharts";
// 1. Import useTransition from React
import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ExerciseRadarChartProps {
    initialData: UserExerciseData;
}

type ChartDataType = {
    subject: string;
    value: number;
    icon: Exercise['icon'];
    fullMark: number;
}[];

export function ExerciseRadarChart({ initialData }: ExerciseRadarChartProps) {
    const [chartData, setChartData] = useState<ChartDataType>([]);
    const [maxMark, setMaxMark] = useState(15);
    
    // 2. Initialize the useTransition hook
    const [_, startTransition] = useTransition();

    useEffect(() => {
        // 3. Wrap your state updates in startTransition
        startTransition(() => {
            const formattedData = EXERCISES.map(exercise => ({
                subject: exercise.name,
                value: initialData?.[exercise.id] || 0,
                icon: exercise.icon,
                fullMark: 0, 
            }));

            const currentMaxVal = Math.max(...formattedData.map(d => d.value), 5);
            const newMaxMark = Math.ceil(currentMaxVal / 5) * 5 + 5;
            
            setMaxMark(newMaxMark);
            setChartData(formattedData.map(d => ({ ...d, fullMark: newMaxMark })));
        });
    }, [initialData]);

    const chartConfig = EXERCISES.reduce((acc, exercise) => {
        acc[exercise.name] = {
            label: exercise.name,
            color: exercise.color,
            icon: exercise.icon,
        };
        return acc;
    }, {} as ChartConfig);

    if (chartData.length === 0) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-primary">Your Exercise Balance</CardTitle>
                    <CardDescription>Loading chart data...</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Initializing...</p>
                </CardContent>
            </Card>
        );
    }

    const CustomPolarAngleAxisTick = (props: any) => {
        const { payload, cx, cy, index } = props;
        const exercise = EXERCISES.find(ex => ex.name === payload.value);
        const IconComponent = exercise?.icon;
        const angle = (index / chartData.length) * 360;
        const angleRad = (angle - 90) * (Math.PI / 180);
        const outerRadius = Math.min(cx, cy) - 15;
        const iconX = cx + outerRadius * Math.cos(angleRad);
        const iconY = cy + outerRadius * Math.sin(angleRad);
        
        return (
            <g>
                {IconComponent && (
                    <IconComponent
                        x={iconX - 12}
                        y={iconY - 12}
                        className="h-6 w-6"
                        style={{ color: exercise?.color }}
                    />
                )}
            </g>
        );
    };

    return (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
                {/* <CardTitle className="font-headline text-2xl text-primary">Your Exercise Balance</CardTitle> */}
                {/* <CardDescription>Visualize your activity across different exercise types.</CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[450px]">
                    <RechartsRadarChart 
                        cx="50%" 
                        cy="50%" 
                        outerRadius="80%" 
                        data={chartData}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={<CustomPolarAngleAxisTick />}
                        />
                        
                        {/* PolarRadiusAxis and ChartLegend are now disabled as requested */}
                        {/* <PolarRadiusAxis angle={30} domain={[0, maxMark]} /> */}
                        
                        <Radar
                            name="Exercise Count"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsla(var(--primary), 0.5)"
                            fillOpacity={0.6}
                            strokeWidth={2}
                        />
                        
                        {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    </RechartsRadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}