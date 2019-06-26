# Translations/CMS

React package for translations and CMS.

## Wrapper

Use the HOC to wrap your application. Use the settings to layout some ground rules.

```JSX
import { Translator } from '@lefapps/translations'

const props = {
  settings: {
    languages: ['nl', 'fr'],
    default: 'nl',
    titles: {
      nl: 'Nederlands',
      fr: 'Français'
    }
  },
  // * required
  getTranslation: ({ props: { _id, md, category, params }, args: { language, skipSettings }}) => {},
  // * required
  // should return a promise with returning a translation object or undefined, should return full translation object if no language is defined
  setUserLanguage: language => {},
  // sets a language to a user object
  getUserLanguage: () => {},
  // gets the language of the current logged in user
  allowEditing: () => {},
  // * required
  // checks if editing a translation is allowed, should return a boolean
  updateTranslation: doc => {},
  // * required
  // updates a translation where translations are kept, should return a promise returning a translation object
  MarkdownImageUpload: () => {}
  // should return a React component which calls the onSubmit prop function returning a string with a markdown formatted image
}

<Translator {...props}>
  // your app code
</Translator>
```

## Text component

Use the `<Translate />` React component to insert text in the app. Editing the translation is possible by double clicking on it. Optionally use `md` to set as a textfield (with markdown support). Set `getString` to return the translation as a string. Default a `<span>` will be returned, but this can be overridden with the `tag` prop. Optionally use the `category` prop to classify translations and make the admin overview clearer. Extra classes can be added through the prop `className`. The `_id` is diplayed by default if no translation is available. You can override this by setting the prop `autoHide`. Use the `params` prop to use placeholders in the translation.

```JSX
import { Translate } from '@lefapps/translations'

<Translate _id='welcome_message' md category='home' autoHide params={{username: user.profile.name}} />
```

## Pick language menu

This creates a bootstrap uncontrolled dropdown menu for use in a `nav` element. Setting the `showTitle` prop to `true` will show full language names (set in the translator settings) instead of showing a flag icon and language abbreviations.

```JSX
import { PickLanguage } from '@lefapps/translations'

<PickLanguage showTitles />
```

## withTranslator

If for some reason you need the current language settings or want to change some of them you can use `withTranslator`.

```JSX
import { withTranslator } from '@lefapps/translations'

const Component = ({translator}) => {
  return (
    <p>This is the current language: {translator.currentLanguage}</p>
    <button onClick={() => translator.setCurrentLanguage('nl')}>
      Set current language to NL
    </button>
  )
}

const ComponentContainer = withTranslator(Component)
```

`translator` state looks usually like this:
```JS
const translator = {
  currentLanguage: 'nl',
  default: 'nl',
  languages: ['nl', 'fr', 'en'],
  setCurrentLanguage: lang => {},
  translations: {}
}
```

## Fontawesome icons helper file

Import a file with this structure on startup, translations needs these icons:

```JS
import { library } from '@fortawesome/fontawesome-svg-core'

import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag'
// ...etc

library.add(faQuestion, faFlag, faCheck, faEdit, faTimes, faPlus, faAlignLeft, faEye)
```
