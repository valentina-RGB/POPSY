import React from 'react';
import ContentLoader from 'react-content-loader';

const DataTableSkeleton = ({ columns = 5, rows = 5, width = 1500, height = 400 }) => {
  const columnWidth = width / columns - 20;
  const rowHeight = height / (rows + 1); // +1 to account for header row

  return (
    <ContentLoader
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        Array.from({ length: columns }).map((_, colIndex) => (
          <rect
            key={`${rowIndex}-${colIndex}`}
            x={colIndex * (columnWidth + 20)} // Add some spacing between columns
            y={rowIndex * (rowHeight + 10) + 50} // Start below header and space between rows
            rx="10"
            ry="10"
            width={columnWidth}
            height={rowHeight - 10}
          />
        ))
      ))}
    </ContentLoader>
  );
};

export default DataTableSkeleton;