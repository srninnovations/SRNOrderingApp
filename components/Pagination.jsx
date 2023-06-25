import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';
import {HStack} from 'native-base';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {DOTS, usePagination} from '../utils/PaginateUtils';

const Pagination = props => {
  const {itemsCount, pageSize, currentPage} = props;
  const paginationRange = usePagination({
    currentPage,
    totalCount: itemsCount,
    siblingCount: 1,
    pageSize,
  });
  const pagesTotal = Math.ceil(itemsCount / pageSize);
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }
  return (
    <HStack space={2} pt={4} justifyContent={'center'}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => props.onPageChange(currentPage - 1)}
        className={`w-10 h-10 rounded-md items-center justify-center ${
          currentPage === 1 ? 'bg-[#3292e2]/50' : 'bg-[#3292e2]'
        } mr-4`}>
        <FeatherIcon name="chevron-left" size={35} color="#fff" />
      </TouchableOpacity>
      {paginationRange.map(page => {
        if (page === DOTS) {
          return <Text className="text-black text-3xl">&#8230;</Text>;
        }
        return (
          <TouchableOpacity
            key={page}
            onPress={() => props.onPageChange(Number(page))}
            className={`w-14 h-10 rounded-md items-center justify-center ${
              currentPage === page ? 'bg-custom-primary' : 'bg-custom-secondary'
            }`}>
            <Text className="text-white text-xl ">{page}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        disabled={currentPage === pagesTotal}
        onPress={() => props.onPageChange(currentPage + 1)}
        className={`w-10 h-10 rounded-md items-center justify-center ${
          currentPage === pagesTotal ? 'bg-[#3292e2]/50' : 'bg-[#3292e2]'
        } ml-4`}>
        <FeatherIcon name="chevron-right" size={35} color="#fff" />
      </TouchableOpacity>
    </HStack>
  );
};

export default Pagination;
