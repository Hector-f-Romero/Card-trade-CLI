import { setTimeout } from "timers/promises";

import ora, { Ora } from "ora";

export class SpinnerSingleton {
	private static instance: SpinnerSingleton;
	public spinner: Ora;

	constructor() {
		this.spinner = ora({ text: "Default spinner message", spinner: "boxBounce2" });
	}

	public static getInstance() {
		if (!SpinnerSingleton.instance) {
			SpinnerSingleton.instance = new SpinnerSingleton();
		}
		return SpinnerSingleton.instance;
	}

	private changeMessage(message: string) {
		this.spinner = ora({ text: message, spinner: "boxBounce2" });
	}

	public async startSpinner(message: string, waitTime: number) {
		this.changeMessage(message);
		this.spinner.start();
		await setTimeout(waitTime);
		this.stopSpinner();
	}

	public async stopSpinner() {
		return this.spinner.stop();
	}
}
