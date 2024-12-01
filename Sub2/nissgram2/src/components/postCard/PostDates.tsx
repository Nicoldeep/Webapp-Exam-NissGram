import React from "react";

interface PostDatesProps {
  dateCreated: Date;
  dateUpdated: Date;
}

const PostDates: React.FC<PostDatesProps> = ({ dateCreated, dateUpdated }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <p className="text-muted">
      <small>Posted on {formatDate(dateCreated)}</small>
      <br />
      <small>Last updated on {formatDate(dateUpdated)}</small>
    </p>
  );
};

export default PostDates;