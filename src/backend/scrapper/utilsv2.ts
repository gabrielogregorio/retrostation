/* eslint-disable no-useless-escape */

export const getShowName = (name: string) =>
  name
    .toLowerCase()
    .replace(/_/g, ' ') // game_name => game name
    .replace(/\(.*?\)/g, '') // (br)
    .replace(/\[.*?\]/g, '') // [br]
    .normalize('NFD') // [ção] -> cao
    .replace(/\s{1,}/g, ' ') // '    ' -> ' '
    .replace(/[\u0300-\u036f]/g, '') // ção -> cao
    .replace(/[\[(][^\])]*$/g, '') // -> gameName(br _ gameName[br -> gameName
    .replace('-image', '') // gameName-image.swf
    .replace(/_?v\d{1,}\.\d{1,}_?/, '') // _v100.999_ _ v10.42_ _ _v2.3 ->
    .trim();

export const onlyLettersAndNumbers = (name: string) => getShowName(name).replace(/[^a-zA-Z0-9]{1,}/g, '');
