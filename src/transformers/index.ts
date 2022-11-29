import type ts from 'typescript';

import arrowFunctionCompatFactories from './arrow-function-compat';
import classFactories from './class';
import exportFactories from './export';
import forOfFactories from './for-of';
import { finalTransformer } from './helpers/utils';
import importPathFactories from './import-path';
import methodFactories from './method';
import parameterDefaultValueFactories from './parameter-default-value';
import throwFactories from './throw';
import undefinedFactories from './undefined';

const transformers: ts.CustomTransformers = {
  before: [...classFactories],
  after: [
    ...importPathFactories,
    ...undefinedFactories,
    ...forOfFactories,
    ...throwFactories,
    ...methodFactories,
    ...parameterDefaultValueFactories,
    ...arrowFunctionCompatFactories,
    ...exportFactories,
    // perform global injections
    finalTransformer,
  ],
};

export default transformers;
