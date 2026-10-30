import { NoticeDetailResponseDtoDataStatus } from '~/shared/api/generated/model/personnel-notices'
export const noticeStatuses = Object.values(NoticeDetailResponseDtoDataStatus)
export const noticePending = NoticeDetailResponseDtoDataStatus.PENDING_VERIFICATION
