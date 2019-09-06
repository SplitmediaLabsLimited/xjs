import parser from 'fast-xml-parser';

class AppProps {
  static scenes = {
    key: 'presetconfig',
    getTransformer: (xml: string) => {
      const sceneObject = parser.parse(xml, {
        attributeNamePrefix: '',
        ignoreAttributes: false,
      });
      const scenes =
        sceneObject.placement.item instanceof Array
          ? sceneObject.placement.item
          : [sceneObject.placement.item];

      return scenes;
    },
  };
}
