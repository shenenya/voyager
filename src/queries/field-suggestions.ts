
import {FieldQuery} from 'compassql/build/src/query/encoding';
import {Query} from 'compassql/build/src/query/query';
import {SHORT_WILDCARD} from 'compassql/build/src/wildcard';
import {ResultIndex} from '../models/result';
import {QueryCreator} from './base';

function makeFieldSuggestionQueryCreator(params: {
  type: keyof ResultIndex,
  title: string,
  additionalFieldQuery: FieldQuery
}): QueryCreator {
  const {type, title, additionalFieldQuery} = params;
  return {
    type,
    title,
    filterSpecifiedView: undefined,
    createQuery(query: Query): Query {
      return {
        spec: {
          ...query.spec,
          encodings: [
            ...query.spec.encodings,
            additionalFieldQuery
          ]
        },
        groupBy: 'field',
        // FieldOrder should dominates everything else
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        // aggregationQuality should be the same
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: { autoAddCount: true }
      };
    }
  };
}

export const addCategoricalField = makeFieldSuggestionQueryCreator({
  type: 'addCategoricalField',
  title: '增加变量分类',
  additionalFieldQuery: {
    channel: SHORT_WILDCARD,
    field: SHORT_WILDCARD,
    type: 'nominal',
    description: '变量分类'
  }
});

export const addQuantitativeField = makeFieldSuggestionQueryCreator({
  type: 'addQuantitativeField',
  title: '增加定量变量',
  additionalFieldQuery: {
    channel: SHORT_WILDCARD,
    bin: SHORT_WILDCARD,
    aggregate: SHORT_WILDCARD,
    field: SHORT_WILDCARD,
    type: 'quantitative',
    description: '定量变量'
  }
});

export const addTemporalField = makeFieldSuggestionQueryCreator({
  type: 'addTemporalField',
  title: '增加时序变量',
  additionalFieldQuery: {
    channel: SHORT_WILDCARD,
    hasFn: true, // Do not show raw time in the summary
    timeUnit: SHORT_WILDCARD,
    field: SHORT_WILDCARD,
    type: 'temporal',
    description: '时序变量'
  }
});
