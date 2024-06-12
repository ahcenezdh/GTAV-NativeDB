import { useEffect } from 'react'
import { NativeDataLoader } from './external'
import { useSettings } from './hooks'
import _ from 'lodash'
import useLocalStorageState from 'use-local-storage-state'
import { Game, useNativeDataContext } from './context'

export default function NativeLoader() {
  const { sources } = useSettings()
  const [ specialFile ] = useLocalStorageState<string | null>('special.json', { defaultValue: null })
  const { setNatives } = useNativeDataContext()
  useEffect(() => {
    for (const game of [ Game.GrandTheftAuto5, Game.RedDeadRedemption2 ]) {
      (async () => {
        const loader = new NativeDataLoader(game)
        if (game === Game.GrandTheftAuto5) {
          await loader.loadFiveM()
        }

        setNatives(game, loader)
      })()
    }
  }, [ setNatives, sources, specialFile ])

  return null
}
