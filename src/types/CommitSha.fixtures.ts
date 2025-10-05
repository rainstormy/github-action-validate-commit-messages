import type { CommitSha } from "#types/CommitSha.ts"
import { requireNotNullish } from "#utilities/Assertions.ts"

const dummyCommitShas: Array<CommitSha> = [
	"024e4f8b044549ac8f833356f20b63af491e46b5",
	"b112c3fd15544eb7a92e200315592089a3a5c486",
	"8fc8b9fc951b4659aaa59776801f2306322b53c8",
	"f3ef1b2fa14a45c2a08f198b5f51c8be10441704",
	"9b600bef662544adb1ee33337290a8a5df094c71",
	"ab787856f5364d38bbf6a777610408704b608ce4",
	"0add1c1507464349bb68f33622b1c4215e5450bf",
	"287dae95144042ec83cad778ed5e2b5378d211f4",
	"d8208c58e41244b3bb85ebca2e010f453efd37e5",
	"b2f9aa6c213840bc84c10a11887eb4cc57c4a750",
	"5e9223042c2b4635a7ea1d20eefdb9871d5b1334",
	"0177096c41ff4c0eaa452dbe79580bf3d6c55abf",
	"f76bd62ea0984843be404a7fa6befc294e63c4d2",
	"46585d444310472c9851c1f576cfd758e0f9e13d",
	"ae60fcaf96ea4a5ea7521aceb4813d3b57d74610",
	"728b311753bf4e8d830f729be8a34e62f2ec8156",
	"71ee01c77a984efeb4d08928d0cd9b7412e72264",
	"0605854fc3444e06abbdc8df443abb8d503be35b",
	"fa2a5e94d5124940a4a61e044205342f20ffca18",
	"07a247d1003c4785a2def9c9f298e052e4ede4f5",
]

let counter = -1

export function nextDummyCommitSha(): CommitSha {
	counter++
	return currentDummyCommitSha()
}

export function currentDummyCommitSha(): CommitSha {
	return requireNotNullish(dummyCommitShas[counter % dummyCommitShas.length])
}
