const fakeDatabase = [{
  fldListValue: 'Other kind of nuts',
  fldSortOrder: 1,
}, {
  fldListValue: 'Peanuts',
  fldSortOrder: 0,
}];
const delay = (ms) =>
  new Promise(resolve => window.setTimeout(resolve, ms));
export const get = () => delay(2000)
  .then(() => fakeDatabase.map(o => ({ ...o })));
export const post = (element) => delay(2000)
  .then(() => {
    if (fakeDatabase.find(o => o.fldListValue === element.fldListValue) !== undefined) {
      throw new Error('409'); // DUPLICATE FLD LIST VALUE
    }
    const newElement = { ...element };
    newElement.fldSortOrder = Math.max(...fakeDatabase.map(o => o.fldSortOrder)) + 1;
    fakeDatabase.push(newElement);
    return newElement;
  });
export const del = (fldListValue) =>
  delay(2000).then(() => {
    const index = fakeDatabase.findIndex(o => o.fldListValue === fldListValue);
    if (index === -1) throw new Error('404'); // MISSING ID
    const deleted = fakeDatabase.splice(index, 1)[0];
    return { ...deleted };
  });
export const change = (fldListValue, element) =>
  delay(2000).then(() => {
    const index = fakeDatabase.findIndex(o => o.fldListValue === fldListValue);
    if (index === -1) throw new Error('404'); // MISSING ID
    const deleted = fakeDatabase.splice(index, 1)[0];
    if (fakeDatabase.find(o => o.fldListValue === element.fldListValue) !== undefined) {
      throw new Error('409'); // DUPLICATE FLD LIST VALUE
    }
    const newElement = { ...element };
    fakeDatabase.push(newElement);
    return ({
      fldListValue,
      listValue: newElement,
      deleted,
    });
  });
