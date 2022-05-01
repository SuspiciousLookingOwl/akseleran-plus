import classNames from "classnames";
import { Component, For } from "solid-js";
import { Campaign } from "../../api/getPortfolio";

type EntryListProps = {
	campaign: Campaign;
	active: boolean;
};

const EntryList: Component<EntryListProps> = (props) => {
	return (
		<div>
			<a href={`https://www.akseleran.co.id/portofolio/${props.campaign.campaignUuid}`}>
				<div
					class={classNames([
						"text-white text-right rounded px-[6px] py-0.5 w-full",
						{ "bg-primary": props.active, "bg-primary-light": !props.active },
					])}
				>
					Rp {props.campaign.investmentAmount.toLocaleString()}
				</div>
			</a>
		</div>
	);
};

export type IEntry = {
	date: Date;
	amount?: number;
	campaigns?: Campaign[];
};

type Props = {
	entry: IEntry;
	active: boolean;
};

export const Entry: Component<Props> = (props) => {
	const today = new Date();

	return (
		<div
			class={classNames([
				"flex flex-col p-1 border min-h-[64px] max-h-[168px] -ml-[1px] -mt-[1px]",
				{
					"border-2 border-primary-dark z-10 rounded":
						props.entry?.date.toISOString().split("T")[0] === today.toISOString().split("T")[0],
				},
			])}
		>
			<div class="flex flex-row justify-between items-center">
				<div class={classNames({ "text-neutral-300": !props.active })}>{props.entry.date.getDate()}</div>
				{props.entry.amount && (
					<div class={classNames(["font-semibold text-lg"], { "text-neutral-400": !props.active })}>
						Rp {props.entry.amount.toLocaleString()}
					</div>
				)}
			</div>

			{props.entry?.campaigns && (
				<div class="mt-1 overflow-y-auto ltr space-y-1 pr-1">
					<For each={props.entry.campaigns.sort((a, b) => b.investmentAmount - a.investmentAmount)}>
						{(item) => <EntryList campaign={item} active={props.active} />}
					</For>
				</div>
			)}
		</div>
	);
};
