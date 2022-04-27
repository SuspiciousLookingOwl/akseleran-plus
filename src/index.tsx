import { render } from "solid-js/web";
import { PortfolioCalendar } from "./components/PortfolioCalendar";
import "./index.css";

const waitFor = (selector: string) => {
	return new Promise((resolve) => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(() => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
};

const onRootChange = async (record: MutationRecord[]) => {
	const classes = ["ui", "stackable", "two", "column", "grid"];
	const filtered = record
		.map((r) => r.target as HTMLElement)
		.find((e) => classes.every((c) => e.classList.contains(c)));
	if (!filtered) return;

	const typeBar = document.querySelector<HTMLAnchorElement>(".ui.massive.pointing.secondary.menu");
	const isOnGoingActive = typeBar?.querySelectorAll("a")[0].classList.contains("active");
	let calendar = document.getElementById("root-akseleran-plus");

	if (typeBar && isOnGoingActive) {
		if (!calendar) {
			calendar = document.createElement("div");
			calendar.id = "root-akseleran-plus";
			typeBar.parentNode?.insertBefore(calendar, typeBar.nextSibling);
			render(() => <PortfolioCalendar />, calendar);
		}
	} else {
		calendar?.remove();
	}
};

const run = async () => {
	await waitFor("#root");
	const observer = new MutationObserver(onRootChange);
	const root = document.getElementById("root");
	if (!root) return;
	observer.observe(root, { subtree: true, childList: true });
};
run();
