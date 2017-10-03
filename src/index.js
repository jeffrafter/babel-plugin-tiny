function tinyResolver({ types: t }) {
  function resolver(path, state) {
    const { node } = path;

    let url = state.url || "";
    let source = node.source;
    let specifiers = node.specifiers || [];
    let namespaceName;
    if (specifiers.length) {
      let specifier = specifiers[0];
      if(specifier.type == 'ImportNamespaceSpecifier') {
        namespaceName = specifier.local.name;
      } else {
        namespaceName = specifier.local.name + 'Namespace';
      }
    } else {
      namespaceName = 'anon' + state.anonCount + 'Namespace';
      state.anonCount++;
    }

    // path maybe removed by prev instances
    if (!node) return;

    // TODO do some custom resolution here:
    //if (source.value.startsWith("@")) {
    //  source.value = source.value.replace(/@/, 'https://tiny-packages.s3.amazonaws.com/dist/')
    //  if (!source.value.endsWith(".js")) source.value = source.value + '.js';
    //}

    // Push the dependency
		state.specifiers = state.specifiers || {}
    state.deps = state.deps || [];
    state.deps.push({
      source: source.value,
      url: url
    });

    specifiers.forEach(function(node){
      switch(node.type) {
        case 'ImportDefaultSpecifier':
          state.specifiers[node.local.name] = {
            ns: namespaceName,
            type: 'default'
          };
          break;
        case 'ImportSpecifier':
          state.specifiers[node.local.name] = {
            ns: namespaceName,
            type: 'named',
            prop: node.imported.name
          };
          break;
        case 'ImportNamespaceSpecifier':
          state.specifiers[node.local.name] = {
            ns: namespaceName,
            type: 'star'
          };
          break;
      }
    });

    node.type = 'VariableDeclaration';
    node.kind = 'const';
    node.declarations = [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: namespaceName
        },
        init:
        {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: '_moduleTools'
            },
            property: {
              type: 'Identifier',
              name: 'staticImport'
            }
          },
          arguments: [
            {
              type: 'StringLiteral',
              value: source.value,
              raw: source.raw
            }
          ]
        }
      }
    ];

    delete node.specifiers;
    delete node.source;
  }

  return {
    visitor: {
      ImportDeclaration: resolver,
    },
  };
}

module.exports = tinyResolver;
