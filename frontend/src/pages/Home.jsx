import React, { useEffect } from 'react';
import styled from 'styled-components';
import Project from '../components/Project';
import axios from 'axios';
import useProjects from '../features/projects/useProjects';
import { Skeleton } from 'antd';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const Home = () => {
    const { isLoadingProjects, projects } = useProjects();

    if (isLoadingProjects) return <Skeleton />

    return (
        <div>
            <h1>DỰ ÁN NỔI BẬT</h1>

            {/* <Grid>
                {
                    projects.map((project) => (
                        <Project project={project} key={project.id} />
                    ))
                }
            </Grid> */}
        </div>
    );
}

export default Home;