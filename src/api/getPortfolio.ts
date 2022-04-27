export interface GetPortfolioOngoingRaw {
	data: CampaignRaw[];
	total: number;
	offset: number;
	limit: number;
}

export interface CampaignRaw {
	investment_date: string;
	campaign_name: string;
	investment_amount: number;
	campaign_status: CampaignStatus;
	campaign_uuid: string;
	latest_payout_date?: string;
	next_payout_date: string;
	arrears_days: number;
	total_outstanding: number;
	is_auto_investment: boolean;
}

export interface GetPortfolioOngoing {
	data: Campaign[];
	total: number;
	offset: number;
	limit: number;
}

export interface Campaign {
	investmentDate: Date;
	campaignName: string;
	investmentAmount: number;
	campaignStatus: CampaignStatus;
	campaignUuid: string;
	latestPayoutDate?: Date;
	nextPayoutDate: Date;
	arrearsDays: number;
	totalOutstanding: number;
	isAutoInvestment: boolean;
}

export interface CampaignStatus {
	name: string;
	value: string;
}

const parseDate = (str: string): Date => {
	const parts = str.split(" ");
	parts[0] = parts[0].split("-").reverse().join("-");
	return new Date(parts.join(" "));
};

export const getPortfolio = async (limit = 1000): Promise<GetPortfolioOngoing> => {
	const response = await fetch("https://core.akseleran.com/api/v3/users/portfolio/ongoing?offset=0&limit=" + limit, {
		method: "GET",
		headers: {
			accept: "application/json",
			authorization: `Bearer ${localStorage.getItem("auth_token")}`,
		},
	});

	const bodyRaw = (await response.json()) as GetPortfolioOngoingRaw;

	const body: GetPortfolioOngoing = {
		...bodyRaw,
		data: bodyRaw.data.map((d) => {
			return {
				investmentDate: parseDate(d.investment_date),
				campaignName: d.campaign_name,
				investmentAmount: d.investment_amount,
				campaignStatus: d.campaign_status,
				campaignUuid: d.campaign_uuid,
				latestPayoutDate: d.latest_payout_date ? parseDate(d.latest_payout_date) : undefined,
				nextPayoutDate: parseDate(d.next_payout_date),
				arrearsDays: d.arrears_days,
				totalOutstanding: d.total_outstanding,
				isAutoInvestment: d.is_auto_investment,
			};
		}),
	};

	return body;
};
