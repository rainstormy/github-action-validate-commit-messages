import { requireNotNullish } from "#utilities/Assertions.ts"

export type GithubPullRequestReference = `${string}/${string}#${number}`

const dummyReferences: Array<GithubPullRequestReference> = [
	"rainstormy/comet#127",
	"rainstormy/updraft#24",
	"spdiswal/vitus#76",
	"rainstormy/presets-biome#38",
	"rainstormy/release#11",
	"spdiswal/asciidoc-inter-solarized-stylesheet#3",
	"rainstormy/ssh-key#26",
	"rainstormy/presets-typescript#1",
	"spdiswal/coolciv#4",
	"rainstormy/presets-renovate#14",
	"rainstormy/presets-lefthook#38",
]

let counter = -1

export function nextDummyGithubPullRequestReference(): GithubPullRequestReference {
	counter++
	return currentDummyGithubPullRequestReference()
}

export function currentDummyGithubPullRequestReference(): GithubPullRequestReference {
	return requireNotNullish(dummyReferences[counter % dummyReferences.length])
}
