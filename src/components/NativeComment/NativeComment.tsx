import { Typography, TypographyProps, Link } from '@mui/material'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import Linkify from 'react-linkify'

export interface NativeCommentProps extends TypographyProps {
  children?: React.ReactNode;
}

function NativeComment({ children, sx, ...rest }: NativeCommentProps) {
  return (
    <Typography
      sx={{
        whiteSpace: 'pre-wrap',
        wordBreak:  'break-word',
        ...sx 
      }}
      {...rest}
    >
      <Linkify
        componentDecorator={(decoratedHref, decoratedText, key) => (
          <Link href={decoratedHref} key={key} target="_blank">
            {decoratedText}
          </Link>
        )}
      >
        {children ? (
          <ReactMarkdown>
            {children as string}
          </ReactMarkdown>
        ) : (
          'No description available.'
        )}
      </Linkify>
    </Typography>
  )
}

export default memo(NativeComment)
