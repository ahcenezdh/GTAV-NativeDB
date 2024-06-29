import { Box, Button, Dialog, IconButton, List, ListItem, ListItemText, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { LinkSharp as ShareIcon, OpenInNewSharp as OpenInNewSharpIcon } from '@mui/icons-material'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { createShareUrl, toPascalCase } from '../../common'
import { CodeExamples, NativeComment, NativeDefinition, NativeDetails } from '../../components'
import { useCopyToClipboard, useIsSmallDisplay, useLastNotNull, useNative, useSettings } from '../../hooks'
import { Game, SelectedGameProvider, useSelectedGameContext } from '../../context'
import NativeNotFound from './NativeNotFound'
import NoNativeSelected from './NoNativeSelected'

interface NativeInfoProps {
  native?: string 
}

export default function NativeInfo({ native: nativeHashParam }: NativeInfoProps) {
  const nativeHashNotNull = useLastNotNull(nativeHashParam)
  const [ usageNotFound, setUsageNotFound ] = useState(false)
  console.log(usageNotFound)
  const settings = useSettings()
  const isSmall = useIsSmallDisplay()
  const nativeHash = isSmall ? nativeHashNotNull : nativeHashParam
  const native = useNative(nativeHash ?? '')
  const copyToClipboard = useCopyToClipboard()
  const game = useSelectedGameContext()
  const [ showGta5Definition, setShowGta5Definition ] = useState<string | false>(false)

  const onShare = useCallback(() => {
    copyToClipboard(createShareUrl(`/natives/${nativeHash}`, game))
  }, [ copyToClipboard, nativeHash, game ])

  useEffect(() => {
    setUsageNotFound(false)
  }, [ nativeHash ])

  if (!nativeHash) {
    return (
      <Box sx={{ p: 2 }}>
        <NoNativeSelected />
      </Box>
    )
  }

  if  (!native) {
    return (
      <Box sx={{ p: 2 }}>
        <NativeNotFound nativeHash={nativeHash} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display:    'flex',
          alignItems: 'center',
          gap:        1,
          pb:         1 
        }}
      >
        <Tooltip title="Copy Link">
          <IconButton
            aria-label="copy link"
            color="inherit"
            onClick={onShare}
            size="small"
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>

        <Typography 
          component="h1"
          sx={{ 
            textOverflow: 'ellipsis', 
            overflow:     'hidden' 
          }} 
          variant="h5" 
        >
          {settings.nativeDisplayMode === 'TS' ? toPascalCase(native.name) : native.name}
        </Typography>
      </Box>

      <Stack spacing={2}>
        <Paper sx={{ p: 2 }}>
          <NativeDetails
            build={native.build}
            hash={native.hash}
            jhash={native.jhash}
            variant="body2"
          />

          <NativeDefinition
            name={native.name}
            params={native.params}
            returnType={native.returnType}
            variant="body2"
          />
        </Paper>

        {native.comment && (
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>

            <Paper sx={{ p: 2 }}>
              <NativeComment variant="body2">
                {native.comment}
              </NativeComment>
            </Paper>
          </div>
        )}

        {native.examples && !_.isEmpty(native.examples) && (
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Examples
            </Typography>

            <Paper>
              <CodeExamples
                examples={native.examples}
              />
            </Paper>
          </div>
        )}

        {native.oldNames && (
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Old name
              {native.oldNames?.length !== 1 ? 's' : ''}
            </Typography>

            <Paper>
              <List>
                {native.oldNames.map(oldName => (
                  <ListItem 
                    key={oldName}
                    sx={{
                      textOverflow: 'ellipsis',
                      overflow:     'hidden'
                    }} 
                    dense
                  >
                    <ListItemText primary={oldName} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </div>
        )}

        {game === Game.RedDeadRedemption2 && native.gtaHash && (
          <Button 
            color="inherit"
            onClick={() => setShowGta5Definition(native.gtaHash!)}
            startIcon={<OpenInNewSharpIcon />}
            variant="text"
          >
            GTA5 Native Definition
          </Button>
        )}
      </Stack>

      <Dialog
        maxWidth="xl"
        onClose={() => setShowGta5Definition(false)}
        open={!!showGta5Definition}
        fullWidth
      >
        <SelectedGameProvider game={Game.GrandTheftAuto5}>
          <NativeInfo native={nativeHashParam} />
        </SelectedGameProvider>
      </Dialog>
    </Box>
  )
}
