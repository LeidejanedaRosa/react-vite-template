import React from 'react'

interface JsonLdScriptProps {
  data: Record<string, unknown>
  prettyPrint?: boolean
}

export const JsonLdScript: React.FC<JsonLdScriptProps> = ({
  data,
  prettyPrint = false,
}) => {
  const jsonString = (
    prettyPrint ? JSON.stringify(data, null, 2) : JSON.stringify(data)
  ).replace(/<\/script>/gi, '<\\/script>')

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  )
}
