import { Page } from "../../components/Page";
import { ProductList } from "../../components/ProductList";

import { useGetAllProductsQuery } from "../../redux/productsApi";

export const ListPage = (): JSX.Element => {
  const { data, error, isLoading } = useGetAllProductsQuery();

  return (
    <Page>
      {isLoading ? <div>Loading...</div> : <ProductList products={data} />}
    </Page>
  );
};
