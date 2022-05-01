import { Accessor, createMemo, createResource, createSignal, For, Show } from "solid-js";
import { Campaign, getPortfolio } from "../../api/getPortfolio";
import { Entry, IEntry } from "./Entry";

type GroupedData = {
	date: string;
	amount: number;
	items: Campaign[];
};

export const PortfolioCalendar = () => {
	//#region constants
	const today = new Date();
	const monthLabels = [
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember",
	];
	const dayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
	//#endregion

	//#region states
	const [isCalendarShown, setIsCalendarShown] = createSignal(false);
	const [month, setMonth] = createSignal(today.getMonth());
	const [year, setYear] = createSignal(today.getFullYear());
	//#endregion

	//#region resources
	const [data] = createResource(Number.MAX_SAFE_INTEGER, getPortfolio);
	//#endregion

	//#region memos
	const items = createMemo(() => data()?.data || [], []);
	const firstDay = createMemo(() => new Date(year(), month(), 1).getDay());
	const previousMonth = createMemo(() => new Date(year(), month() - 1));
	const nextMonth = createMemo(() => new Date(year(), month() + 1));

	const entries: Accessor<IEntry[]> = createMemo(() => {
		let grouped: GroupedData[] = [];
		for (const d of items()) {
			const date = d.nextPayoutDate.toISOString().split("T")[0];
			const index = grouped.findIndex((d) => d.date === date);

			if (index < 0) grouped.push({ date, amount: d.totalOutstanding, items: [] });
			else grouped[index].amount += d.totalOutstanding;

			grouped.sort((a, b) => b.date.localeCompare(a.date));
		}

		grouped = grouped.map((g) => {
			g.items = items().filter((d) => d.nextPayoutDate.toISOString().split("T")[0] === g.date);
			return g;
		});

		return [...Array(7 * 5)].map((_, i) => {
			const date = new Date(year(), month(), i - firstDay() + 1);
			const item = grouped.find(
				(i) => new Date(i.date).getDate() === date.getDate() && new Date(i.date).getMonth() === date.getMonth()
			);
			return { date, amount: item?.amount, campaigns: item?.items };
		});
	});
	//#endregion

	//#region methods
	const updateMonth = (increment: boolean) => {
		if (increment) {
			setMonth(month() + 1);
			if (month() > 11) {
				setMonth(0);
				setYear(year() + 1);
			}
		} else {
			setMonth(month() - 1);
			if (month() < 0) {
				setMonth(11);
				setYear(year() - 1);
			}
		}
	};
	//#endregion

	return (
		<>
			<div
				class="bg-primary-dark py-3 w-full cursor-pointer text-center text-white text-xl mb-4 select-none rounded-md"
				onClick={() => setIsCalendarShown(!isCalendarShown())}
			>
				{isCalendarShown() ? "Sembunyikan" : "Tampilkan"} Kalender
			</div>
			<Show when={isCalendarShown()}>
				<div class="w-full mb-12 p-4 shadow-md shadow-neutral-300 border border-neutral-300 rounded">
					<div class="grid grid-cols-3 items-end justify-between space-x-4">
						{previousMonth().getMonth() >= today.getMonth() ||
						previousMonth().getFullYear() > today.getFullYear() ? (
							<div
								class="flex flex-row space-x-2 cursor-pointer px-2 select-none items-center justify-start"
								onClick={() => updateMonth(false)}
							>
								<div class="text-2xl font-bold text-primary">&lt;</div>
								<div class="text-lg text-neutral-400">
									{monthLabels[previousMonth().getMonth()]} {previousMonth().getFullYear()}
								</div>
							</div>
						) : (
							<div />
						)}
						<div class="text-2xl font-bold text-neutral-600 text-center">
							{monthLabels[month()]} {year()}
						</div>
						<div
							class="flex flex-row space-x-2 cursor-pointer px-2 select-none items-center justify-end"
							onClick={() => updateMonth(true)}
						>
							<div class="text-lg text-neutral-400">
								{monthLabels[nextMonth().getMonth()]} {nextMonth().getFullYear()}
							</div>
							<div class="text-2xl font-bold text-primary">&gt;</div>
						</div>
					</div>

					<div class="w-full overflow-x-auto p-0.5 mt-6">
						<div class="min-w-[1024px] w-full grid grid-cols-7">
							<For each={dayLabels}>{(dayLabel) => <span>{dayLabel}</span>}</For>
						</div>

						<div class="min-w-[1024px] w-full grid grid-cols-7">
							<For each={entries()}>
								{(entry) => <Entry entry={entry} active={entry.date.getMonth() === month()}></Entry>}
							</For>
						</div>
					</div>
				</div>
			</Show>
		</>
	);
};
