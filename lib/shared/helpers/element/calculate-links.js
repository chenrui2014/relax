import forEach from 'lodash/forEach';

/**
 * Processes an elements links, returning the results
 *
 * @param   {Array} elementLinks
 * @param   {Object} elementProps
 * @param   {Object} values
 */
export default ({element, elementProps, elementLinks, values, valuesPrefix = '', hideEmpty}) => {
  let display = true;
  let children = element.children;
  let context;
  let resultElement = element;
  let builderLink;

  forEach(elementLinks, (link) => {
    // link special property
    if (link.property === 'link_entry') {
      if (values) {
        elementProps[link.action] = {
          type: 'external',
          options: {
            url: `/${values.schemaSlug}/${values.slug}`
          }
        };
      }
      return true;
    }

    // get value
    const value = values[`${valuesPrefix}${link.property}`];

    switch (link.action) {
      // change element children (text)
      case 'children':
        if (value) {
          resultElement = Object.assign({}, element, {
            children: value
          });
          elementProps.children = value;
          children = value;
        } else if (hideEmpty) {
          display = false;
        }
        break;

      // show element only if value "true"
      case 'show':
        if (!value) {
          display = false;
        }
        break;

      // hide element only if value "true"
      case 'hide':
        if (value) {
          display = false;
        }
        break;

      // change element children (page builder data)
      case 'builderFragment':
        context = {
          doc: 'draft',
          property: link.property
        };
        children = value; // && value.body && value.body.children;
        builderLink = link;
        break;

      // special case for form elements
      case 'name':
        elementProps[link.action] = link.property;
        break;

      // change some element prop
      default:
        elementProps[link.action] = value;
    }
  });

  return {
    element: resultElement,
    elementProps,
    display,
    children,
    context,
    builderLink
  };
};
