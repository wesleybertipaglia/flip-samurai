'use client';

import { Card, CardBody } from '@progress/kendo-react-layout';
import { Skeleton } from '@progress/kendo-react-indicators';

export const StatCard = ({ title, value, description, isLoading }: {
    title: string,
    value: string | number,
    description?: string,
    isLoading?: boolean
}) => (
    <Card className="mb-4 shadow-sm">
        <CardBody>
            <div>
                <p className="font-weight-bold">{title}</p>
                {isLoading ? (
                    <Skeleton className="h-9 w-24 mt-1" />
                ) : (
                    <p className="text-4xl">{value}</p>
                )}
            </div>
            {description && (
                <p className="text-muted text-small">{description}</p>
            )}
        </CardBody>
    </Card>
);
