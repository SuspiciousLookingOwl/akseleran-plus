import { render } from "solid-js/web";
import { PortfolioCalendar } from "./components/PortfolioCalendar";
import "./index.css";

const validPath = "/portofolio";

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

const onRootChange = async () => {
	if (!window.location.pathname.startsWith(validPath)) return;

	const typeBar = document.querySelector<HTMLAnchorElement>(".ui.massive.pointing.secondary.menu");
	let calendar = document.getElementById("root-akseleran-plus");

	if (typeBar && !calendar) {
		if (!calendar) {
			calendar = document.createElement("div");
			calendar.id = "root-akseleran-plus";
			typeBar.parentNode?.insertBefore(calendar, typeBar);
			render(() => <PortfolioCalendar />, calendar);
		}
	} else if (!typeBar) {
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
