interface SeasonType {
  id: number
  name: string
  active: boolean
}
interface SeasonsFetch {
  status: string
  data: {
    count: number
    items: SeasonType[]
    limit: number
    offset: number
  }
}

export interface Competition {
  id: number
  name: string
  gender: string
  season: SeasonType
  title: string
}
interface CompetitionFetch {
  status: string
  data: {
    count: number
    items: Competition[]
    limit: number
    offset: number
  }
}

export interface Match {
  id: number
  dateTime: string
  firstTeamName: string
  secondTeamName: string
  firstTeamScore: number
  secondTeamScore: number
  firstTeamLogoUuid: string
  secondTeamLogoUuid: string
  sportHallAddress: string
  sportHallName: string
  status: string
  round: number
  competitions: any
  competitionName: string
}

interface MatchFetch {
  status: string
  data: {
    count: number
    items: Match[]
    limit: number
    offset: number
  }
}

export interface Club {
  id: number
  shortName: string
  fullName: string
  logoUuid: string
}

interface ClubsFetch {
  status: string
  data: {
    items: Club[]
  }
}
interface ClubFetch {
  status: string
  data: Club
}

export interface Standing {
  awayLost: number
  awayWon: number
  gamesPlayed: number
  lost: number
  points: number
  ptsMinus: number
  ptsPlus: number
  logoUuid: string
  team: {
    id: number
    name: string
  }
  teamId: number
  won: number

}
// const runtimeConfig = useRuntimeConfig()
const dayjs = useDayjs()

export const useKZSStore = defineStore('kzs', {
  state: () => ({
    seasons: [] as SeasonType[],
    competitions: [] as Competition[],
    api: useRuntimeConfig().public.KZS_API,
  }),
  actions: {
    async getAllCompetitions() {
      if (this.competitions.length > 0)
        return this.competitions
      const response = await $fetch<CompetitionFetch>(`${this.api}/competitions/`, {
        params: {
          sortBy: 'name',
          sort: 'ASC',
          limit: 10000,
        },
      })
      const competitions = response.data.items

      function compareCompetitions(a: Competition, b: Competition) {
        if (a.season.id < b.season.id)
          return 1
        else if (a.season.id > b.season.id)
          return -1
        else
          return a.name.localeCompare(b.name)
      }

      competitions.sort(compareCompetitions)
      for (const competition of competitions)
        competition.title = `${competition.name} (20${competition.season.id.toString().padStart(2, '0')})`
      this.competitions = competitions
      return competitions
    },
    async getSeasons() {
      return $fetch<SeasonsFetch>(`${this.api}/seasons/`, {
        params: {
          sortBy: 'name',
          sort: 'DESC',
        },
      }).then(res => {
        this.seasons = res.data.items
        return res.data.items
      }).catch(err => err)
    },

    async getCompetitions(seasonId: number) {
      return $fetch<CompetitionFetch>(`${this.api}/competitions/`, {
        params: {
          sortBy: 'name',
          sort: 'ASC',
          limit: 10000,
          seasonId,
        },
      }).then(res => {
        return res.data.items
      }).catch(err => err)
    },
    async getCompetition(competitionId: number) {
      return $fetch<{ status: number, data: Competition }>(`${this.api}/competitions/${competitionId}`).then(res => {
        return res.data
      }).catch(err => err)
    },

    async getMatches({
      seasonId = null as number | null,
      competitionId = null as number | null,
      clubId = null as number | null,
      statuses = null as string | null,
      sort = 'DESC' as 'DESC' | 'ASC',
      sortBy = 'dateTime' as string | null,
      limit = 10000 as number | null,
      competitionInTitle = false as boolean,
    }) {
      return $fetch<MatchFetch>(`${this.api}/matches/`, {
        params: {
          requestType: 'FETCH',
          offset: 0,
          limit,
          seasonId,
          competitionIds: competitionId,
          statuses,
          sort,
          sortBy,
          clubId,
        },
      }).then(res => {
        const matches = []

        // only use contain matches if a firstTeamName or secondTeamName contains the word 'krka'
        const krkaMatches = res.data.items.filter(match => match.firstTeamName.toLowerCase().includes('krka') || match.secondTeamName.toLowerCase().includes('krka'))
        for (const match of krkaMatches) {
          const scoresText = match.firstTeamScore && match.secondTeamScore ? `(${match.firstTeamScore}:${match.secondTeamScore}) ` : ''
          const formattedDate = dayjs(match.dateTime).format('DD.MM.YYYY HH:mm')
          const competitionName = competitionInTitle ? `${match.competitions[0].competitionName}` : ''
          const title = `${competitionName} ${match.firstTeamName} VS ${match.secondTeamName} ${scoresText}- ${formattedDate}`
          matches.push({
            id: match.id,
            dateTime: match.dateTime,
            firstTeamName: match.firstTeamName,
            secondTeamName: match.secondTeamName,
            firstTeamScore: match.firstTeamScore,
            secondTeamScore: match.secondTeamScore,
            firstTeamLogoUuid: match.firstTeamLogoUuid,
            secondTeamLogoUuid: match.secondTeamLogoUuid,
            status: match.status,
            sportHallAddress: match.sportHallAddress,
            sportHallName: match.sportHallName,
            title,
            round: match.round,
            competitionName: match.competitions[0].competitionName
          })
        }
        return matches
      }).catch(err => err)
    },
    async getAllClubs() {
      const response = await $fetch<ClubsFetch>(`${this.api}/clubs/`, {
        params: {
          sortBy: 'fullName',
          sort: 'ASC',
          limit: 1000,
        },
      })
      return response.data.items
    },
    async getClub(id: number) {
      const response = await $fetch<ClubFetch>(`${this.api}/clubs/${id}`)
      return response.data
    },
    async getStandings(competitionId: number) {
      const response = await $fetch<any>(`${this.api}/matches/standings`, {
        params: {
          competitionId,
        },
      })
      const standings = [] as any
      for (const phase of response.data.phases) {
        const phaseName = phase.competitionPhase.name
        if (phase.groups.length > 0) {
          for (const group of phase.groups) {
            const groupPhaseName = group.competitionPhaseGroup.name
            standings.push({
              name: `${phaseName} - ${groupPhaseName}`,
              items: group.standings,
            })
          }
        }
        else {
          standings.push({
            name: phaseName,
            items: phase.standings,
          })
        }
      }

      return standings
    },
  },
})
