import { NextRequest, NextResponse } from 'next/server';
import { investigateGrowthAnomaly, GrowthAnomalyParams } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const params: GrowthAnomalyParams = {
      eventType: body.eventType || 'stripe_checkout_churn',
      title: body.title || 'Stripe Checkout Churn Spike',
      source: body.source || 'Stripe',
      metricBaseline: body.metricBaseline || '72.4%',
      metricCurrent: body.metricCurrent || '54.2%',
      contextData: body.contextData || {},
      customPrompt: body.customPrompt,
      simulatedOutage: Boolean(body.simulatedOutage),
    };

    const result = await investigateGrowthAnomaly(params);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Growth anomaly investigation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete Eric AI investigation',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
