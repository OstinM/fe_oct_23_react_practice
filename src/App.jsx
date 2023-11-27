import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const preparedProducts = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(productCategory => productCategory.id === product.categoryId);
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return {
    ...product,
    user,
    categories: category,
  };
});

function getFilteredList(products, query, filterCategory, owner) {
  let preparedProductisList = [...products];

  if (query) {
    preparedProductisList = preparedProductisList.filter(product => (
      product.name.toLowerCase()
        .includes(query.toLowerCase().trim())
    ));
  }

  if (filterCategory) {
    preparedProductisList = preparedProductisList.filter(product => (
      product.categories.ownerId === filterCategory
    ));
  }

  if (owner) {
    preparedProductisList = preparedProductisList.filter(product => (
      product.categories.ownerId === owner
    ));
  }

  return preparedProductisList;
}

export const App = () => {
  const [categoryOwner, setCategoryOwner] = useState('');
  const [filteredName, setFilteredName] = useState('');
  const [filteredCategory, setFilteredCategory] = useState('');

  const visibleProducts
    = getFilteredList(
      preparedProducts,
      filteredName,
      filteredCategory,
      categoryOwner,
    );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <div className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': categoryOwner === '' })}
                onClick={() => {
                  setCategoryOwner('');
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={cn({ 'is-active': categoryOwner === user.id })}
                  onClick={() => {
                    setCategoryOwner(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filteredName}
                  onChange={(event) => {
                    setFilteredName(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {filteredName && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setFilteredName('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => {
                  setFilteredCategory('');
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn('button mr-2', {
                    'my-1 is-info': filteredCategory === category.id,
                  })}
                  href="#/"
                  onClick={() => {
                    setFilteredCategory(category.id);
                  }}
                >
                  {category.title}
                </a>

              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setCategoryOwner('');
                  setFilteredName('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            {visibleProducts.length === 0
              && ('No products matching selected criteria')}
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map(product => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.categories.icon}
                    -
                    {product.categories.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={product.user.sex
                      === 'm' ? 'has-text-link' : 'has-text-danger'}
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
