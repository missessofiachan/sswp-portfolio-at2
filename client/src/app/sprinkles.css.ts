import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';
import { vars } from './theme.css';

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
    flexWrap: ['nowrap', 'wrap'],
    gap: vars.space,
    rowGap: vars.space,
    columnGap: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    padding: vars.space,
    margin: vars.space,
    width: ['100%', 'auto'],
    maxWidth: ['100%', vars.size.container],
    textAlign: ['left', 'center', 'right'],
  },
  shorthands: {
    p: ['padding'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    m: ['margin'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
  },
});

const colorProperties = defineProperties({
  conditions: {
    default: {},
    hover: { selector: '&:hover' },
    focusVisible: { selector: '&:focus-visible' },
  },
  defaultCondition: 'default',
  properties: {
    color: vars.color,
    backgroundColor: vars.color,
    borderColor: vars.color,
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);
export type Sprinkles = Parameters<typeof sprinkles>[0];
