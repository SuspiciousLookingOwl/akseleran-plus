export interface GetPortfolioOngoingRaw {
	data: CampaignRaw[];
	total: number;
	offset: number;
	limit: number;
}

export interface CampaignRaw {
	investment_date: string;
	campaign_name: string;
	user_id: number;
	campaign_id: number;
	slug: string;
	campaign_group: null;
	investment_amount: number;
	campaign_status: CampaignStatus;
	campaign_loan_quality_status: string;
	campaign_uuid: string;
	latest_payout_date: string;
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
	slug: string;
	totalOutstanding: number;
	isAutoInvestment: boolean;
	state: CampaignState;
}

export type CampaignState = "current" | "special_mention" | "sub_standard" | "doubtful";

export interface CampaignStatus {
	name: string;
	value: string;
}

const parseDate = (str: string): Date => {
	const parts = str.split(" ");
	parts[0] = parts[0].split("-").reverse().join("-");
	return new Date(parts.join(" "));
};

export const getPortfolio = async (limit = 1000): Promise<Campaign[]> => {
	const accept = "application/json";
	const authorization = `Bearer ${localStorage.getItem("auth_token")}`;

	const base = "https://core.akseleran.com/api/v3/users/portfolio";
	const states: CampaignState[] = ["current", "special_mention", "sub_standard", "doubtful"];

	const responses = await Promise.all(
		states.map(async (state) => {
			const response = await fetch(`${base}/${state}?offset=0&limit=${limit}`, {
				method: "GET",
				headers: { accept, authorization },
			});

			const bodyRaw = (await response.json()) as GetPortfolioOngoingRaw;

			return bodyRaw.data.map((d) => {
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
					slug: d.slug,
					state,
				};
			});
		})
	);

	return responses.flat();
};
