'use client';
import { useMemo, useEffect, useState, useRef } from 'react';
// client
import { useMutation, useQuery } from 'urql';

// models / query
import {
  ReportComment,
  REPORT_COMMENT_MUTATION,
} from '../models/reportComment';
import { PostComment } from '../models/WyrPostComment';

export const useStatelessReportComment = () => {
  const [result, executeMutation] = useMutation<{
    reportComment: ReportComment;
  }>(REPORT_COMMENT_MUTATION);

  return {
    state: {
      // reportCommentState: result,
    },
    actions: {
      reportCommentByIds: ({
        commentId,
        communityId,
        reason,
      }: {
        commentId: string;
        communityId: string;
        reason: string;
      }) => {
        const promise = executeMutation({
          commentId: commentId,
          communityId: communityId,
          reason: reason,
        });
        return promise;
      },
    },
  };
};
