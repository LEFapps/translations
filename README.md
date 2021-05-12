# Translations (@lefapps)

This package should be accompanied by `@lefapps/translations-server` to get the fulle experience.

## Setup

#### Install from npm:

```SHELL
npm i @lefapps/translations
```

#### Import in your app:

```JSX
import { Translator } from '@lefapps/translations'
```

#### Define a translator configuration:

```JSX
const languages = ['nl', 'fr', 'en'] // you are free to decide how they look
const defaultLanguage = languages[0]
const translatorConfig = {
  languages,
  language:
    typeof navigator !== 'undefined'
      ? (navigator.language || navigator.userLanguage).split('-')[0] || defaultLanguage
      : defaultLanguage,
  canEdit: () => true // must be a function
}
```

#### Wrap your app code:

```JSX
const App = () => {
  return (
    <Translator {...translatorConfig}>
      // App code
    </Translator>
  )
}
```

**Note:** changing the language can be done by changing the language prop in the config.

#### Use the Translate Component:

```JSX
import { Translate } from '@lefapps/translations'

const Content = page => {
  return <Translate _id={page} />
}
```

#### Access the raw translation string:

```JSX
import { useRawTranslation } from '@lefapps/translations'

const Logo = ({ src }) => {
  const { translation } = useRawTranslation('menu/logo/alt')
  return <h1><img src={src} alt={translation} /></h1>
}
```

#### Include the languageSwitcher:

```JSX
import { PickLanguage } from '@lefapps/translations'

const Header = () => {
  return (
    <header>
      <h1>My Brand</h1>
      <nav>
        <ul />
        <PickLanguage />
      </nav>
    </header>
  )
}
```

## Translate

Use the `Translate` component to fetch translations using a specific identifier.

### Props

| Prop      | Type                | Required? | Default   | Description                                                           |
| --------- | ------------------- | --------- | --------- | --------------------------------------------------------------------- |
| \_id      | String              | ✓         | ""        | Identifier of the translation (see [guidelines](#guidelines))         |
| md        | Bool                |           | false     | Formatted using MarkDown (html rendered using the markdown-it plugin) |
| tag       | String<br>Component |           | span      | HTML tag to wrap the translation                                      |
| className | String              |           | ""        | Optional classnames for                                               |
| params    | Object              |           | {}        | Replace text: `{{key}}` gets replaced by its `value`                  |
| autoHide  | Bool                |           | false     | Hide the component when the translation is empty                      |
| children  | String<br>Nodes     |           | null      | Initial value while loading                                           |
| language  | String              |           | [current] | Force a different language to be loaded                               |

#### Guidelines

We recommend to define your identifiers with the following schema:

```YAML
header
header/menu
header/menu/about
header/menu/about/team
header/menu/about/contact
etc...
```

This way you can easily group and organise them in your storage/database.

### Attributes

The following HTML attributes are automatically applied on the element:

```YAML
.translation: always present
.translation__loading: present while fetching
.translation__md: present when markdown formatting is applied
.translation__error: present when an error occurred while loading
[data-translation]: the identifier
```

\*The component is automatically subtly styled while loading.

## useRawTranslation

Use the `useRawTranslation` hook to fetch translations as a string instead of React Component.

#### Notes

1. To keep your code organised, only use `useRawTranslation` when necessary<br/>(e.g. for `alt` or `title` attributes — these do not accept React Components).
1. The returned translation is the raw string. If the value contains MarkDown, you should take care of encoding it in your app.

### Arguments

Accepts one argument, the identifier: `useRawTranslation(_id)`.

### Returns

| Key         | Type   | Description                                                     |
| ----------- | ------ | --------------------------------------------------------------- |
| loading     | Bool   | True while the translation is being fetched                     |
| error       | Object | Populated with Apollo Error if something goes wrong             |
| translation | String | Translation for the identifier in the currently active language |
| \_id        | String | Identifier of the translation                                   |
| md          | Bool   | Whether the returned string contains MarkDown                   |
| params      | Array  | Available keys                                                  |

## PickLanguage

Use this component to change language. it is automatically hidden when only one language is provided.

### Props

| Prop      | Type            | Required? | Default | Description                              |
| --------- | --------------- | --------- | ------- | ---------------------------------------- |
| children  | String<br>Nodes |           | null    | Content to show as label of the dropdown |
| showTitle | Bool            |           | false   | Show the current language                |

### Attributes

The following HTML attributes are automatically applied on the element:

```YAML
"#language-picker": always present
```

No default styling is applied on this component.

The languages shown in the picker are Translate components with the following identifier: `translator/{{language}}`. Transalte them to your linking!

## Internals

If you want to access certain dynamic fields from the translator, e.g. the current language, use the useTranslator hook.

```JSX
import { useTranslator } from '@lefapps/translations'

const Page = () => {
  const { languages, setLanguage } = useTranslator()

  return (
    <ul>
      {languages.map(lang => {
        return <li key={lang} onClick={() => setLanguage(lang)}>
          {lang}
        </li>
      })}
    </ul>
  )
}
```

The same can be achieved with the HOC `withTranslator`:

```JSX
import { withTranslator } from '@lefapps/translations'

const SetEnglish = withTranslator(({ language }) => {
  return (
    <p>
      This is the current language: {language}
      <br/>
      <button onClick={() => setLanguage('en')}>
        Set current language to EN
      </button>
    </p>
  )
})
```

### Props

These values can be retrieved from the hook/hoc:

| Prop        | Type         | Description                     |
| ----------- | ------------ | ------------------------------- |
| language    | String       | Currently selected language     |
| languages   | [String]     | All available languages         |
| setLanguage | Function(ln) | Change current language to `ln` |

## Data Fetching

The transltions are fetched over the wire using GraphQl queries and mutations. When your app is using graphql already, you can easily integrate the `queries`. Use the companion package `@lefapps/translations-server` to implement the backend correctly.

## Editing

When the canEdit config returns a non-falsy value, the translated text shows an editor to edit the translation in place after double clicking it. **Note:** this is merely a client-side optimisation, you should always authenticate and validate incoming requests _server-side_.

Otherwise you can build your own backend list to edit each translation. An example:

```JSX
import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { queries, Editor } from '@lefapps/translations'

const Translation = ({ _id }) => {
  const [isOpen, setOpen] = useState(false)
  const onClick = () => setOpen(!isOpen)

  const actions = { onClick }
  const name = _id.split('/')

  return (
    <li key={_id}>
      <h3 {...actions}>{name}</h3>
      <Editor _id={_id} toggle={toggle} isOpen={isOpen} alert={alert} />
    </li>
  )
}

const Translations = () => {
  const { data } = useQuery(queries.TRANSLATION_LIST)
  return (
    <section>
      <h1>Translations</h1>
      <ul>
        {data.translations.map(Translation)}
      </ul>
    </section>
  )
}
```
