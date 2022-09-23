const { DB } = require("../models");

let agGridServer = {
    getData: async function (table, request) {
        const SQL = this.buildSql(table, request)
console.log('SQL : ', SQL)
        let e, r = await DB.sq.query(SQL)
        if (e) {
            console.error(e)
            throw e
        }
        let rowCount = this.getRowCount(request, r[0])
        let resultsForPage = this.cutResultsToPageSize(request, r[0])
        return {
            rowCount,
            resultsForPage
        }
    },

    buildSql: function (table, request) {

        const selectSql = this.createSelectSql(request);
        const fromSql = ' FROM ' + table + ' ';
        const whereSql = this.createWhereSql(request);
        const limitSql = this.createLimitSql(request);

        const orderBySql = this.createOrderBySql(request);
        const groupBySql = this.createGroupBySql(request);

        const SQL = selectSql + fromSql + whereSql + groupBySql + orderBySql + limitSql;

        console.log(SQL);

        return SQL;
    },

    createSelectSql: function (request) {
        const rowGroupCols = request.rowGroupCols;
        const valueCols = request.valueCols;
        const groupKeys = request.groupKeys;
        const customCols = request.customCols;
        
        if ( customCols) {
            const colsToSelect = [];
            customCols.forEach( customCol => {
                if ( customCol.field == '*') {
                    colsToSelect.push('*');
                } else {
                    colsToSelect.push(`(${customCol.field}) as ${customCol.alias ? customCol.alias : customCol.field} `);
                }
            });

            return ' select ' + colsToSelect.join(', ');
        } else if (this.isDoingGrouping(rowGroupCols, groupKeys)) {
            const colsToSelect = [];

            const rowGroupCol = rowGroupCols[groupKeys.length];
            colsToSelect.push(rowGroupCol.field);

            valueCols.forEach(function (valueCol) {
                colsToSelect.push(valueCol.aggFunc + '(' + valueCol.field + ') as ' + valueCol.alias ? valueCol.alias : valueCol.field);
            });

            return ' select ' + colsToSelect.join(', ');
        }

        return ' select *';
    },

    createFilterSql: function (key, item) {
        if (item.operator != null) {
            let idx = 1
            let condition = '('
            while (item['condition' + idx] != null) {
                switch (item['condition' + idx].filterType) {
                    case 'text':
                        condition += this.createTextFilterSql(key, item['condition' + idx]);
                        break;
                    case 'number':
                        condition += this.createNumberFilterSql(key, item['condition' + idx]);
                        break;
                    case 'date':
                        condition += this.createDateFilterSql(key, item['condition' + idx]);
                        break;
                    default:
                        console.log('unkonwn filter type: ' + item['condition' + idx].filterType);
                        break;
                }
                condition += ' ' + item.operator + ' '
                idx++
            }
            let reg = new RegExp(item.operator + ' $')
            condition = condition.replace(reg, ')')
            return condition
        }
        switch (item.filterType) {
            case 'text':
                return this.createTextFilterSql(key, item);
            case 'number':
                return this.createNumberFilterSql(key, item);
            case 'date':
                return this.createDateFilterSql(key, item);
            case 'set':
                return this.createSetFilterSql(key, item);
            default:
                console.log('unkonwn filter type: ' + item.filterType);
        }
    },

    createSetFilterSql: function (key, item) {
        return `${key} IN ('${item.values.join('\',\'')}')`
    },

    createDateFilterSql: function (key, item) {
        if ( item.customFormat && item.customFormat == 1) {
            key = `date_format(${key}, '%Y-%m-%d')`
            
            item.dateFrom = item.dateFrom.slice(0,10)

            if ( item.dateTo) {
                item.dateTo = item.dateTo.slice(0,10)
            }
        }
        
        switch (item.type) {
            case 'equals':
                return `${key} = '${item.dateFrom}'`
            case 'notEqual':
                return `${key} != '${item.dateFrom}'`
            case 'greaterThan':
                return `${key} > '${item.dateFrom}'`
            case 'lessThan':
                return `${key} < '${item.dateFrom}'`
            case 'inRange':
                return `${key} BETWEEN '${item.dateFrom}' AND '${item.dateTo}'`
            default:
                console.log('unknown date filter type: ' + item.type)
                return 'true'
        }
    },

    createNumberFilterSql: function (key, item) {
        switch (item.type) {
            case 'equals':
                return key + ' = ' + item.filter;
            case 'notEqual':
                return key + ' != ' + item.filter;
            case 'greaterThan':
                return key + ' > ' + item.filter;
            case 'greaterThanOrEqual':
                return key + ' >= ' + item.filter;
            case 'lessThan':
                return key + ' < ' + item.filter;
            case 'lessThanOrEqual':
                return key + ' <= ' + item.filter;
            case 'inRange':
                return '(' + key + ' >= ' + item.filter + ' and ' + key + ' <= ' + item.filterTo + ')';
            default:
                console.log('unknown number filter type: ' + item.type);
                return 'true';
        }
    },

    createTextFilterSql: function (key, item) {
        switch (item.type) {
            case 'equals':
                return key + ' = "' + item.filter + '"';
            case 'notEqual':
                return key + ' != "' + item.filter + '"';
            case 'contains':
                return key + ' like "%' + item.filter + '%"';
            case 'notContains':
                return key + ' not like "%' + item.filter + '%"';
            case 'startsWith':
                return key + ' like "' + item.filter + '%"';
            case 'endsWith':
                return key + ' like "%' + item.filter + '"';
            default:
                console.log('unknown text filter type: ' + item.type);
                return 'true';
        }
    },

    createWhereSql: function (request) {
        const rowGroupCols = request.rowGroupCols;
        const groupKeys = request.groupKeys;
        const filterModel = request.filterModel;

        const that = this;
        const whereParts = [];

        if (groupKeys.length > 0) {
            groupKeys.forEach(function (key, index) {
                const colName = rowGroupCols[index].field;
                whereParts.push(colName + ' = "' + key + '"')
            });
        }

        if (filterModel) {
            const keySet = Object.keys(filterModel);
            keySet.forEach(function (key) {
                const item = filterModel[key];
                whereParts.push(that.createFilterSql(key, item));
            });
        }

        if (whereParts.length > 0) {
            return ' where ' + whereParts.join(' and ');
        } else {
            return '';
        }
    },

    createGroupBySql: function (request) {
        const rowGroupCols = request.rowGroupCols;
        const groupKeys = request.groupKeys;

        if (this.isDoingGrouping(rowGroupCols, groupKeys)) {
            const colsToGroupBy = [];

            const rowGroupCol = rowGroupCols[groupKeys.length];
            colsToGroupBy.push(rowGroupCol.field);

            return ' group by ' + colsToGroupBy.join(', ');
        } else {
            // select all columns
            return '';
        }
    },

    createOrderBySql: function (request) {
        const rowGroupCols = request.rowGroupCols;
        const groupKeys = request.groupKeys;
        const sortModel = request.sortModel;

        const grouping = this.isDoingGrouping(rowGroupCols, groupKeys);

        const sortParts = [];
        if (sortModel) {

            const groupColIds =
                rowGroupCols.map(groupCol => groupCol.id)
                    .slice(0, groupKeys.length + 1);

            sortModel.forEach(function (item) {
                if (grouping && groupColIds.indexOf(item.colId) < 0) {
                    // ignore
                } else {
                    sortParts.push(item.colId + ' ' + item.sort);
                }
            });
        }

        if (sortParts.length > 0) {
            return ' order by ' + sortParts.join(', ');
        } else {
            return '';
        }
    },

    isDoingGrouping: function (rowGroupCols, groupKeys) {
        // we are not doing grouping if at the lowest level. we are at the lowest level
        // if we are grouping by more columns than we have keys for (that means the user
        // has not expanded a lowest level group, OR we are not grouping at all).
        return rowGroupCols.length > groupKeys.length;
    },

    createLimitSql: function (request) {
        const startRow = request.startRow;
        const endRow = request.endRow;
        const pageSize = endRow - startRow;
        if (startRow == null || endRow == null) {
            return ''
        }
        return ' limit ' + (pageSize + 1) + ' offset ' + startRow;
    },

    getRowCount: function (request, results) {
        if (results === null || results === undefined || results.length === 0) {
            return null;
        }
        const currentLastRow = request.startRow + results.length;
        return currentLastRow <= request.endRow ? currentLastRow : -1;
    },

    cutResultsToPageSize: function (request, results) {
        const pageSize = request.endRow - request.startRow;
        if (results && results.length > pageSize) {
            return results.splice(0, pageSize);
        } else {
            return results;
        }
    },
}

module.exports = agGridServer